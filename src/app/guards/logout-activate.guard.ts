import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

export const logoutActivateGuard: CanActivateFn = () => {
  const authservice = inject(AuthService);
  const router = inject(Router);

  return authservice.isLogged().pipe(
    map((resp) => {
      if (resp) {
        return router.createUrlTree(['/videojuegos']);
      } else {
        return true;
      }
    })
  );
};
