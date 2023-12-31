import {
  HttpErrorResponse,
  HttpHeaders,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { NotificationService } from '../utils/notification.service';
import { tap } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(NotificationService);
  return next(req).pipe(
    tap({
      error(err) {
        if (err instanceof HttpErrorResponse) {
        }
      },
    })
  );
};
