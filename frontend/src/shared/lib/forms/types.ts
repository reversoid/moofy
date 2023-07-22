export type Message = string;

/** Validator function for Final Form */
export type Validator<T> = (
  value: T,
) => Message | undefined | Promise<Message | undefined>;
