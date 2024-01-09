import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthTokenService } from '../utils/auth-token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthTokenService);
  const accessToken = authService.accessToken;

  let newHeaders: HttpHeaders = req.headers;
  if (accessToken) {
    newHeaders = req.headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const newReq = req.clone({ headers: newHeaders });
  return next(newReq);
};
