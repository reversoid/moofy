import { authService } from '@/features/auth/services/auth.service';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

export const checkUsernameDebounced = AwesomeDebouncePromise(
  async (username: string) => {
    const exists = await authService.checkUsernameExistence(username);
    return exists ? 'Имя пользователя уже занято' : undefined;
  },
  250,
  { accumulate: false, onlyResolvesLast: false },
);
