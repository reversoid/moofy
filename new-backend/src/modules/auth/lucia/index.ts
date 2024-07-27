import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { PrismaClient } from '@prisma/client';
import { Lucia, TimeSpan } from 'lucia';

const client = new PrismaClient();

const adapter = new PrismaAdapter(client.session, client.users);

export const lucia = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(25, 'w'),
  sessionCookie: {
    attributes: {
      // TODO set to `true` when using HTTPS
      secure: process.env.NODE_ENV === 'production',
    },
  },
});

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
  }
}
