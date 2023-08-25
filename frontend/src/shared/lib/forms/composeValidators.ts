import { Validator } from './types';

/** Compose multiple validators. First error message will be returned */
export const composeValidators =
  <T>(...validators: Validator<T>[]) =>
  async (value: T) => {
    for (const validator of validators) {
      const error = await validator(value);
      if (error) {
        return error;
      }
    }
    return undefined;
  };
