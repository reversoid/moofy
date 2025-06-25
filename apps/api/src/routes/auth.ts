import { Hono } from "hono";
import { validator } from "../utils/validator";
import z from "zod";
import { deleteCookie, getCookie, setSignedCookie } from "hono/cookie";
import config from "@repo/config";
import { UsernameExistsError } from "@repo/core/services";
import { makeUserDto } from "../utils/make-dto";
import {
  AuthenticatorTransportFuture,
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { authMiddleware } from "../utils/auth-middleware";
import { db } from "@repo/repositories/db";
import crypto from "node:crypto";

const rpName = "Moofy";

const rpID = "localhost";

const origin = `http://localhost:3000`;

// TODO: get registration + auth options
// TODO verify reg and auth response

const transportsSchema = z.array(
  z.enum(["ble", "cable", "hybrid", "internal", "nfc", "smart-card", "usb"])
);

const optionsSchema = z.object({
  attestation: z.string().optional(),
  authenticatorSelection: z
    .object({
      authenticatorAttachment: z
        .enum(["cross-platform", "platform"])
        .optional(),
      requireResidentKey: z.boolean().optional(),
      residentKey: z.enum(["discouraged", "preferred", "required"]).optional(),
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
});

export const authRoute = new Hono()
  .get("/webauthn/registration/options", authMiddleware, async (c) => {
    const { user } = c.get("session")!;

    const existingPasskeys = await db
      .selectFrom("userPasskeys")
      .selectAll()
      .where("userId", "=", user.id.value)
      .execute();

    const options: PublicKeyCredentialCreationOptionsJSON =
      await generateRegistrationOptions({
        rpID,
        rpName,
        userName: user.username,
        attestationType: "none",
        excludeCredentials: existingPasskeys.map((p) => ({
          id: p.id,
          transports: (p.transports ?? undefined) as
            | AuthenticatorTransportFuture[]
            | undefined,
        })),
        authenticatorSelection: {
          residentKey: "preferred",
          userVerification: "preferred",
          authenticatorAttachment: "platform",
        },
      });

    // TODO when redis is ready, save options to redis, remove signing feature

    const signature = crypto
      .createHmac("sha256", config.API_SIGNATURE_KEY)
      .update(JSON.stringify(options))
      .digest("hex");

    return c.json({ options, signature }, 200);
  })
  .post(
    "/webauthn/registration/verify",
    authMiddleware,
    validator(
      "json",
      z.object({
        originalOptions: optionsSchema,
        signature: z.string(),
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
      const {
        originalOptions,
        signature: targetSignature,
        response,
      } = c.req.valid("json");

      const { user } = c.get("session")!;

      const receivedSignatureBuffer = Uint8Array.from(
        crypto
          .createHmac("sha256", config.API_SIGNATURE_KEY)
          .update(JSON.stringify(originalOptions))
          .digest()
      );

      const targetSignatureBuffer = Uint8Array.from(
        Buffer.from(targetSignature, "hex")
      );

      if (receivedSignatureBuffer.length !== targetSignatureBuffer.length) {
        return c.json({ error: "INVALID_SIGNATURE" }, 400);
      }

      const isValidOptions = crypto.timingSafeEqual(
        receivedSignatureBuffer,
        targetSignatureBuffer
      );

      if (!isValidOptions) {
        return c.json({ error: "INVALID_SIGNATURE" }, 400);
      }

      try {
        const { verified, registrationInfo } = await verifyRegistrationResponse(
          {
            response,
            expectedOrigin: origin,
            expectedRPID: rpID,
            expectedChallenge: originalOptions.challenge,
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
              webauthnUserId: originalOptions.user.id,
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

  // .get("/webauthn/auth/options", authMiddleware, (c) => {})
  // .post("/webauthn/auth/verify")

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
