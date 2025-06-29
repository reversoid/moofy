import { Hono } from "hono";
import { validator } from "../utils/validator";
import z from "zod";
import { deleteCookie, getCookie, setSignedCookie } from "hono/cookie";
import config from "@repo/config";
import { UsernameExistsError } from "@repo/core/services";
import { makeUserDto } from "../utils/make-dto";
import {
  AuthenticatorTransportFuture,
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { authMiddleware } from "../utils/auth-middleware";
import { db } from "@repo/repositories/db";
import crypto from "node:crypto";

const rpName = "Moofy";

const rpID = "localhost";

const origin = `http://localhost:3000`;

const transportsSchema = z.array(
  z.enum(["ble", "cable", "hybrid", "internal", "nfc", "smart-card", "usb"])
);

const getUserPasskeys = async (userId: number) => {
  const existingPasskeys = await db
    .selectFrom("userPasskeys")
    .selectAll()
    .where("userId", "=", userId)
    .execute();

  return existingPasskeys.map((p) => ({
    ...p,
    transports: (p.transports ?? undefined) as
      | AuthenticatorTransportFuture[]
      | undefined,
  }));
};
const getUserPasskey = async (passkeyId: string) => {
  const existingPasskey = await db
    .selectFrom("userPasskeys")
    .selectAll()
    .where("id", "=", passkeyId)
    .executeTakeFirst();

  return existingPasskey
    ? {
        ...existingPasskey,
        transports: parseTransportsArray(existingPasskey.transports),
      }
    : null;
};

const createBase64UrlSignature = (data: unknown): string => {
  return crypto
    .createHmac("sha256", config.API_SIGNATURE_KEY)
    .update(JSON.stringify(data))
    .digest("base64url");
};

const verifyBase64UrlSignature = (
  data: unknown,
  dataSignature: string
): boolean => {
  const receivedDataSignatureBuffer = Uint8Array.from(
    crypto
      .createHmac("sha256", config.API_SIGNATURE_KEY)
      .update(JSON.stringify(data))
      .digest()
  );

  const expectedDataSignatureBuffer = Uint8Array.from(
    Buffer.from(dataSignature, "base64url")
  );

  if (
    receivedDataSignatureBuffer.length !== expectedDataSignatureBuffer.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    receivedDataSignatureBuffer,
    expectedDataSignatureBuffer
  );
};

const parseTransportsArray = (
  v: string[] | null
): AuthenticatorTransportFuture[] | undefined => {
  return v ? transportsSchema.parse(v) : undefined;
};

export const authRoute = new Hono()
  .get("/webauthn/registration/options", authMiddleware, async (c) => {
    const { user } = c.get("session")!;

    const existingPasskeys = await getUserPasskeys(user.id.value);

    const options: PublicKeyCredentialCreationOptionsJSON =
      await generateRegistrationOptions({
        rpID,
        rpName,
        userName: user.username,
        attestationType: "none",
        excludeCredentials: existingPasskeys.map((p) => ({
          id: p.id,
          transports: p.transports ?? undefined,
        })),
        authenticatorSelection: {
          residentKey: "preferred",
          userVerification: "preferred",
          authenticatorAttachment: "platform",
        },
      });

    // TODO when redis is ready, save options to redis, remove signing feature

    const signature = createBase64UrlSignature(options);

    return c.json({ options, signature }, 200);
  })
  .post(
    "/webauthn/registration/verify",
    authMiddleware,
    validator(
      "json",
      z.object({
        originalOptions: z.object({
          data: z.object({
            attestation: z.string().optional(),
            authenticatorSelection: z
              .object({
                authenticatorAttachment: z
                  .enum(["cross-platform", "platform"])
                  .optional(),
                requireResidentKey: z.boolean().optional(),
                residentKey: z
                  .enum(["discouraged", "preferred", "required"])
                  .optional(),
                userVerification: z
                  .enum(["discouraged", "preferred", "required"])
                  .optional(),
              })
              .optional(),
            challenge: z.string(),
            excludeCredentials: z
              .array(
                z.object({
                  id: z.string(),
                  transports: z.array(z.string()).optional(),
                  type: z.string(),
                })
              )
              .optional(),
            extensions: z.record(z.any()).optional(),
            hints: z.array(z.string()).optional(),
            pubKeyCredParams: z.array(
              z.object({ alg: z.number(), type: z.literal("public-key") })
            ),
            rp: z.object({ id: z.string().optional(), name: z.string() }),
            timeout: z.number().optional(),
            user: z.object({
              displayName: z.string(),
              id: z.string(),
              name: z.string(),
            }),
          }),
          signature: z.string(),
        }),
        response: z.object({
          id: z.string(),
          rawId: z.string(),
          response: z.object({
            attestationObject: z.string(),
            clientDataJSON: z.string(),
          }),
          type: z.literal("public-key"),
          clientExtensionResults: z.object({
            appid: z.boolean().optional(),
            credProps: z
              .object({
                rk: z.boolean().optional(),
              })
              .optional(),
            hmacCreateSecret: z.boolean().optional(),
          }),
          transports: transportsSchema.optional(),
        }),
      })
    ),
    async (c) => {
      const { originalOptions, response } = c.req.valid("json");

      const { user } = c.get("session")!;

      if (
        !verifyBase64UrlSignature(
          originalOptions.data,
          originalOptions.signature
        )
      ) {
        return c.json({ error: "INVALID_SIGNATURE" }, 400);
      }

      try {
        const { verified, registrationInfo } = await verifyRegistrationResponse(
          {
            response,
            expectedOrigin: origin,
            expectedRPID: rpID,
            expectedChallenge: originalOptions.data.challenge,
          }
        );

        if (verified && registrationInfo) {
          const { credential, credentialDeviceType, credentialBackedUp } =
            registrationInfo;

          await db
            .insertInto("userPasskeys")
            .values({
              backup: credentialBackedUp,
              counter: credential.counter,
              publicKey: credential.publicKey,
              deviceType: credentialDeviceType,
              id: credential.id,
              userId: user.id.value,
              webauthnUserId: originalOptions.data.user.id,
              transports: credential.transports,
            })
            .execute();
        }

        return c.json({ verified }, 200);
      } catch (e) {
        if (e instanceof Error) {
          return c.json({ error: "BAD_VERIFY", details: e.message }, 400);
        }
        throw e;
      }
    }
  )

  .get("/webauthn/auth/options", authMiddleware, async (c) => {
    const { user } = c.get("session")!;
    const userPasskeys = await getUserPasskeys(user.id.value);

    const options: PublicKeyCredentialRequestOptionsJSON =
      await generateAuthenticationOptions({
        rpID,
        allowCredentials: userPasskeys.map((passkey) => ({
          id: passkey.id,
          transports: passkey.transports,
        })),
      });

    const signature = createBase64UrlSignature(options);

    return c.json({ options, signature }, 200);
  })
  .post(
    "/webauthn/auth/verify",
    authMiddleware,
    validator(
      "json",
      z.object({
        originalOptions: z.object({
          data: z.object({
            challenge: z.string(),
          }),
          signature: z.string(),
        }),
        response: z.object({
          id: z.string(),
          rawId: z.string(),
          response: z.object({
            clientDataJSON: z.string(),
            authenticatorData: z.string(),
            signature: z.string(),
            userHandle: z.string().optional(),
          }),
          authenticatorAttachment: z
            .enum(["cross-platform", "platform"])
            .optional(),
          clientExtensionResults: z.object({
            appid: z.boolean().optional(),
            credProps: z
              .object({
                rk: z.boolean().optional(),
              })
              .optional(),
            hmacCreateSecret: z.boolean().optional(),
          }),
          type: z.literal("public-key"),
        }),
      })
    ),
    async (c) => {
      const { user } = c.get("session")!;
      const { originalOptions, response } = c.req.valid("json");

      const existingPasskey = await getUserPasskey(response.id);

      if (!existingPasskey) {
        return c.json({ error: "NO_PASSKEY" as const }, 401);
      }

      const verification = await verifyAuthenticationResponse({
        response: response,
        expectedChallenge: originalOptions.data.challenge,
        expectedOrigin: origin,
        expectedRPID: rpID,
        credential: {
          id: existingPasskey.id,
          publicKey: existingPasskey.publicKey,
          counter: existingPasskey.counter,
          transports: existingPasskey.transports,
        },
      });

      const { verified, authenticationInfo } = verification;

      if (verified) {
        await db
          .updateTable("userPasskeys")
          .set({ counter: authenticationInfo.newCounter })
          .where("id", "=", existingPasskey.id)
          .execute();
      }

      return c.json({ verified }, 200);
    }
  )

  .post(
    "/login",
    validator(
      "json",
      z.object({
        username: z.string(),
        password: z.string(),
      })
    ),
    async (c) => {
      const { username, password } = c.req.valid("json");
      const userService = c.get("userService");
      const sessionService = c.get("sessionService");

      const userResult = await userService.validateUsernameAndPassword({
        username,
        password,
      });

      if (userResult.isErr()) {
        return c.json({ error: "INVALID_CREDENTIALS" as const }, 401);
      }

      const user = userResult.unwrap();

      const token = sessionService.generateSessionToken();
      const session = await sessionService.createSession(token, user);

      await setSignedCookie(c, "session", token, config.COOKIE_SECRET, {
        httpOnly: true,
        secure: config.ENV === "production" || config.ENV === "staging",
        sameSite: "Lax",
        path: "/",
        expires: session.expiresAt,
      });

      return c.json({ user: makeUserDto(session.user) }, 200);
    }
  )
  .post(
    "/register",
    validator(
      "json",
      z.object({
        username: z.string(),
        password: z.string().min(8),
      })
    ),
    async (c) => {
      const { username, password } = c.req.valid("json");
      const userService = c.get("userService");
      const sessionService = c.get("sessionService");

      const createResult = await userService.createUser({
        username,
        password,
      });

      if (createResult.isErr()) {
        const error = createResult.unwrapErr();

        if (error instanceof UsernameExistsError) {
          return c.json({ error: "USERNAME_EXISTS" as const }, 400);
        }

        throw error;
      }

      const newUser = createResult.unwrap();

      const token = sessionService.generateSessionToken();
      const session = await sessionService.createSession(token, newUser);

      await setSignedCookie(c, "session", token, config.COOKIE_SECRET, {
        httpOnly: true,
        secure: config.ENV === "production" || config.ENV === "staging",
        sameSite: "Lax",
        path: "/",
        expires: session.expiresAt,
      });

      return c.json({ user: makeUserDto(session.user) }, 200);
    }
  )
  .post("/logout", async (c) => {
    const sessionToken = getCookie(c, "session");
    const sessionService = c.get("sessionService");

    if (sessionToken) {
      await sessionService.invalidateSession(sessionToken);

      deleteCookie(c, "session");
    }

    return c.body(null, 204);
  });
