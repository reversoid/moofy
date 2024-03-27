import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ENVIRONMENT } from '../../environments/provider';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const { apiUrl } = inject(ENVIRONMENT);

  const newReq = req.clone({ url: `${apiUrl}/${req.url}`, withCredentials: true });
  return next(newReq);
};
