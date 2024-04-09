import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { baseUrlInterceptor } from './interceptors/base-url.interceptor';
import { authInterceptor } from './interceptors/base-url-auth.interceptor';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([baseUrlInterceptor, authInterceptor])),
    importProvidersFrom(SweetAlert2Module.forRoot()), provideAnimationsAsync()

  ]
};
