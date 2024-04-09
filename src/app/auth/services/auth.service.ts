import { HttpClient } from '@angular/common/http';
import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { TokenResponse } from '../interfaces/responses';
import { UsuarioLogin, UsuarioRegistro } from '../interfaces/usuarios';
import { Usuario } from '../interfaces/usuarios';
import { SsrCookieService } from 'ngx-cookie-service-ssr';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  #http = inject(HttpClient);
  #logged: WritableSignal<boolean> = signal(false);
  cookieService = inject(SsrCookieService);

  registro(user: UsuarioRegistro): Observable<void> {
    return this.#http.post<void>('auth/register', user);
  }

  login(user: UsuarioLogin): Observable<void> {
    return this.#http.post<TokenResponse>('auth/login', user).pipe(
      map((r) => {
        this.cookieService.set('token', r.accessToken);
        this.#logged.set(true);
      })
    );
  }

  Logout(): void {
    this.cookieService.delete('token');
    this.#logged.set(false);
  }

  get logged() {
    return this.#logged.asReadonly(); 
  }

  isLogged(): Observable<boolean> {
    if (!this.#logged() && !this.cookieService.check('token')) {
      return of(false);
    } else if (this.#logged()) {
      return of(true);
    } else if (
      !this.#logged() &&
      this.cookieService.check('token')
    ) {
      return this.#http.get('auth/validate').pipe(
        map(() => {
          this.#logged.set(true);
          return true;
        }),
        catchError(() => {
          this.cookieService.delete('token');
          return of(false);
        })
      );
    }
    return of(false);
  }

  loginGoogle(data: string): Observable<void> {
    const data2 = {token: data};
    return this.#http.post<TokenResponse>('auth/google', data2).pipe(map(r => {
      this.cookieService.set('token', r.accessToken);
      this.#logged.set(true);
    }))
  }
}

