import { Routes } from '@angular/router';
import { logoutActivateGuard } from '../guards/logout-activate.guard';


export const routesAuth: Routes = [
 
  {
    path: 'login',
    title: 'Login',
    canActivate: [logoutActivateGuard],
    loadComponent: () =>
    import('./login/login.component').then(
      (m) => m.LoginComponent
    ),
  },
  {
    path: 'registro',
    title: 'Registro',
    canActivate: [logoutActivateGuard],
    loadComponent: () =>
    import('./register/register.component').then(
      (m) => m.RegisterComponent
    ),
  }
 
 
];
