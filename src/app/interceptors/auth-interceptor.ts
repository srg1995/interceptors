import { isPlatformServer } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformid = inject(PLATFORM_ID);

  if (isPlatformServer(platformid)) {
    return next(req);
  }
  const token = localStorage.getItem('token');
  let header = req.headers;
  if (token) {
    header = header.set('Authorization', `Bearer ${token}`);
  }
  const authReq = req.clone({ headers: header });
  return next(authReq);
};
