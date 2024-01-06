import { HttpClient, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../utils/auth.service';
import { NotificationService } from '../utils/notification.service';

interface ApiError {
  message: string;
  statusCode: number;
}

// TODO fill messages
const ERROR_TRANSLATION: Record<string, string> = {};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const httpClient = inject(HttpClient);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        return (
          httpClient
            // TODO make some typings
            .post<{ accessToken: string }>('auth/protected/refresh', {})
            .pipe(
              switchMap((response) => {
                const newToken = response.accessToken;
                authService.accessToken = newToken;
                return next(req);
              }),
              catchError((refreshError) => {
                return throwError(() => refreshError);
              }),
            )
        );
      }
      return throwError(() => error);
    }),
    catchError((err: HttpErrorResponse) => {
      if (err.error && err.error.message && ERROR_TRANSLATION[err.error.message]) {
        const translation = ERROR_TRANSLATION[err.error.message];
        notificationService.createNotification(translation);
      }
      return throwError(() => err);
    }),
  );
};
