import { MiddlewareHandler } from "hono";
import { AsyncLocalStorage } from "async_hooks";

export interface RequestStore {
  /** Stores repetitive operations in cache within single request */
  cache: Record<string, unknown>;
}

export const asyncLocalStore = new AsyncLocalStorage<RequestStore>();

// Helper to get or initialize the store
export function getStore(): RequestStore {
  let store = asyncLocalStore.getStore();
  if (!store) {
    store = { cache: {} };
    asyncLocalStore.enterWith(store);
  }
  return store;
}

export const withAsyncStorage: MiddlewareHandler = async (c, next) => {
  return asyncLocalStore.run({ cache: {} }, async () => {
    await next();
  });
};
