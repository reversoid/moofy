import { dtoRules } from "./rules";

// Main makeDto function
export function makeDto<T>(data: T): Partial<T> {
  if (!data || typeof data !== "object") {
    return data;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => makeDto(item)) as any;
  }

  // Find matching rule for the constructor
  const constructor = data.constructor;
  const rule = dtoRules.get(constructor);

  if (!rule) {
    return data;
  }

  const result: Partial<T> = {};

  for (const [key, include] of Object.entries(rule)) {
    if (!include) continue;

    const value = data[key as keyof T];

    if (typeof include === "object") {
      // Recursive case: nested object with its own rules
      result[key as keyof T] = makeDto(value) as T[keyof T];
    } else {
      // Base case: boolean include/exclude
      result[key as keyof T] = value;
    }
  }

  return result;
}
