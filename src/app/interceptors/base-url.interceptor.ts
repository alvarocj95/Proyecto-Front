import { HttpInterceptorFn } from '@angular/common/http';
import { isDevMode } from '@angular/core';

export const baseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  const serverUrl = isDevMode()
    ? 'http://localhost:8080'
    : 'http://localhost:8080';

  const clonedReq = req.clone({
    url: `${serverUrl}/${req.url}`
  })
  return next(clonedReq);
};


