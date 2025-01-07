import { dtoRules, type PickableFields, type Transformer } from "./rules";

const isTransformer = (
  rule: PickableFields<unknown> | Transformer<unknown>
): rule is Transformer<unknown> => typeof rule === "function";

export function makeDto<T>(data: T): unknown {
  if (!data || typeof data !== "object") {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map((item) => makeDto(item));
  }

  const constructor = data.constructor;
  const rule = dtoRules.get(constructor);

  if (!rule) {
    const result: Partial<T> = {};

    for (const key in data) {
      const value = data[key];

      result[key as keyof T] = makeDto(value) as T[keyof T];
    }

    return result;
  }

  if (isTransformer(rule)) {
    return rule(data);
  }

  const result: Partial<T> = {};

  for (const [key, include] of Object.entries(rule)) {
    if (!include) continue;

    const value = data[key as keyof T];
    result[key as keyof T] = makeDto(value) as T[keyof T];
  }

  return result;
}
