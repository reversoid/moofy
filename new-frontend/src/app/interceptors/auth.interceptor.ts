import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../utils/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const accessToken = authService.accessToken;

  let newHeaders: HttpHeaders = req.headers;
  if (accessToken) {
    newHeaders = req.headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const newReq = req.clone({ headers: newHeaders });
  return next(newReq);
};
