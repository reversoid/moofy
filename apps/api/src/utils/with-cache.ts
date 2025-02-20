// with-cache.ts

import { getStore } from "./with-async-storage";

/**
 * Wraps an instance in a Proxy. For each method call:
 * 1) Looks up the result in the request-scoped cache.
 * 2) If found, returns it immediately.
 * 3) If not found, calls the original method, then stores the result.
 *
 * skipMethods: methods in this array won't use caching.
 */
export function withCache<T extends object>(
  instance: T,
  skipMethods: (keyof T)[] = []
): T {
  return new Proxy(instance, {
    get(target, prop, receiver) {
      // Original value (function or property)
      const originalValue = Reflect.get(target, prop, receiver);

      // If it's not a function, or we want to skip caching, just return as is
      if (
        typeof originalValue !== "function" ||
        skipMethods.includes(prop as keyof T)
      ) {
        return originalValue;
      }

      // Otherwise, wrap the function in caching logic
      return async (...args: any[]) => {
        const store = getStore();

        // Simple cache key: methodName + JSON-ified args
        const cacheKey = `${String(prop)}:${JSON.stringify(args)}`;

        console.log("store is", store.cache);

        // Return from cache if present
        if (cacheKey in store.cache) {
          console.log("RETURN CACHED");

          return store.cache[cacheKey];
        }

        // Otherwise, call original method, store the result, then return
        const result = await originalValue.apply(target, args);
        store.cache[cacheKey] = result;
        return result;
      };
    },
  });
}
