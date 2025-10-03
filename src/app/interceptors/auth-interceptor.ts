import { isPlatformServer } from '@angular/common';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformid = inject(PLATFORM_ID);
  const authService = inject(AuthService);
  if (isPlatformServer(platformid)) {
    return next(req);
  }
  const token = localStorage.getItem('token');
  let header = req.headers;
  if (token) {
    header = header.set('Authorization', `Bearer ${token}`);
  }
  const authReq = req.clone({ headers: header });

  //el usuario pide algo con el token
  //server devuelve 401 o 403
  //interceptor pilla el error
  //llama a refresh token
  //si va bien, repite la llamada con el nuevo token y le actualizamos el localstorage
  //si va mal, devolvemos error
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        return authService.refreshToken().pipe(
          switchMap((newToken: string) => {
            const newHeader = authReq.headers.set('Authorization', `Bearer ${newToken}`);
            const newAuthReq = authReq.clone({ headers: newHeader });
            return next(newAuthReq);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
