import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError, map, tap, catchError } from 'rxjs';

interface LoginResponse {
  token: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseURL = 'https://token-project-xi.vercel.app';
  http = inject(HttpClient);
  router = inject(Router);

  //el token nosotros lo utilizamos para las peticiones(autenticacion), para la autorizacion seria tema de roles
  refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      this.logOut();
      return throwError(() => new Error('No refresh token available'));
    }
    return this.http
      .post<{ refresToken: string }>(`${this.baseURL}/refresh-token`, { refreshToken })
      .pipe(
        map((response) => response.refresToken),
        tap((newAccessToken: string) => {
          localStorage.setItem('token', newAccessToken);
        }),
        catchError((error) => {
          this.logOut();
          return throwError(() => new Error('Failed to refresh token'));
        })
      );
  }
  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseURL}/login`, { username, password });
  }

  logOut() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
