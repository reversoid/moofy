import { Hono } from "hono";
import { validator } from "../utils/validator";
import z from "zod";
import { deleteCookie, getCookie, setSignedCookie } from "hono/cookie";
import config from "@repo/config";
import { UsernameExistsError } from "@repo/core/services";
import { makePasskeyDto, makeUserDto } from "../utils/make-dto";
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { authMiddleware } from "../utils/auth-middleware";
import { db } from "@repo/repositories/db";
import {
  getUserPasskeys,
  rpID,
  rpName,
  getUserPasskey,
  transportsSchema,
  parseTransportsArray,
  updatePasskey,
  deletePasskey,
  origin,
} from "../utils/passkeys";
import {
  createBase64UrlSignature,
  verifyBase64UrlSignature,
} from "../utils/signature";
import { raise } from "@repo/core/sdk";

export const authRoute = new Hono()
  .get("/webauthn/registration/options", authMiddleware, async (c) => {
    const { user } = c.get("session")!;

    const existingPasskeys = await getUserPasskeys(user.id.value);

    if (existingPasskeys.length >= 100) {
      return c.json({ error: "TOO_MANY_PASSKEYS" as const }, 409);
    }

    const options: PublicKeyCredentialCreationOptionsJSON =
      await generateRegistrationOptions({
        rpID,
        rpName,
        userName: user.username,
        attestationType: "none",
        excludeCredentials: existingPasskeys.map((p) => ({
          id: p.id,
          transports: parseTransportsArray(p.transports),
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
        return c.json({ error: "INVALID_SIGNATURE" as const }, 400);
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

          const { id } = await db
            .insertInto("userPasskeys")
            .values({
              nickname: "New Passkey",
              backup: credentialBackedUp,
              counter: credential.counter,
              publicKey: credential.publicKey,
              deviceType: credentialDeviceType,
              id: credential.id,
              userId: user.id.value,
              webauthnUserId: originalOptions.data.user.id,
              transports: credential.transports,
            })
            .returning("id")
            .executeTakeFirstOrThrow();

          const createdPasskey =
            (await getUserPasskey(id)) ?? raise("Passkey must be created");

          return c.json({ passkey: makePasskeyDto(createdPasskey) }, 200);
        }

        throw new Error("Could not verify");
      } catch (e) {
        if (e instanceof Error) {
          return c.json(
            { error: "BAD_VERIFY" as const, details: e.message },
            400
          );
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
          transports: parseTransportsArray(passkey.transports),
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
          transports: parseTransportsArray(existingPasskey.transports),
        },
      });

      const { verified, authenticationInfo } = verification;

      if (verified) {
        await updatePasskey(existingPasskey.id, {
          counter: authenticationInfo.newCounter,
        });
      }

      return c.json({ verified }, 200);
    }
  )

  .get("/passkeys", authMiddleware, async (c) => {
    const { user } = c.get("session")!;

    const passkeys = await getUserPasskeys(user.id.value);

    return c.json({ passkeys: passkeys.map(makePasskeyDto) }, 200);
  })

  .patch(
    "/passkeys/:id",
    validator(
      "json",
      z.object({
        nickname: z.string().min(1).max(32),
      })
    ),
    validator(
      "param",
      z.object({
        id: z.string().min(1),
      })
    ),
    authMiddleware,
    async (c) => {
      const { user } = c.get("session")!;
      const { nickname } = c.req.valid("json");
      const { id } = c.req.valid("param");

      const passkey = await getUserPasskey(id);

      if (passkey?.userId !== user.id.value) {
        return c.json({ error: "PASSKEY_NOT_FOUND" as const }, 400);
      }

      await updatePasskey(passkey.id, { nickname });

      return c.json({ passkey: makePasskeyDto({ ...passkey, nickname }) }, 200);
    }
  )

  .delete(
    "/passkeys/:id",
    validator(
      "param",
      z.object({
        id: z.string().min(1),
      })
    ),
    authMiddleware,
    async (c) => {
      const { user } = c.get("session")!;
      const { id } = c.req.valid("param");

      const passkey = await getUserPasskey(id);

      if (passkey?.userId !== user.id.value) {
        return c.json({ error: "PASSKEY_NOT_FOUND" as const }, 400);
      }

      await deletePasskey(passkey.id);

      return c.body(null, 204);
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
