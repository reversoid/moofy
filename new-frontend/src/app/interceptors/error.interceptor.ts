import {
  HttpErrorResponse,
  HttpHeaders,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { NotificationService } from '../utils/notification.service';
import { tap } from 'rxjs';

interface ApiError {
  message: string;
  statusCode: number;
}

const isApiError = (value: any): value is ApiError => {
  return (
    typeof value === 'object' &&
    typeof value.statusCode === 'number' &&
    typeof value.message === 'string'
  );
};

// TODO fill messages
const ERROR_TRANSLATION: Record<string, string> = {};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    tap({
      error(err) {
        if (!(err instanceof HttpErrorResponse)) {
          return;
        }
        if (!isApiError(err.error)) {
          return;
        }
        const translation = ERROR_TRANSLATION[err.error.message];
        if (!translation) {
          return;
        }
        notificationService.createNotification(translation);
      },
    })
  );
};
