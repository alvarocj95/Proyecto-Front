import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

export const loginActivateGuard: CanActivateFn = () => {
  const authservice = inject(AuthService);
  const router = inject(Router);

  return authservice.isLogged().pipe(
    map((resp) => {
      if (resp) {
        return true;
      } else {
        return router.createUrlTree(['/auth/login']);
      }
    })
  );
};
