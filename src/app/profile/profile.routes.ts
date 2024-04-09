import { Routes } from '@angular/router';
//import { loginActivateGuard } from '../guards/login-activate.guard';

export const profileroutes: Routes = [
  {
    path: 'me',
    title: 'Mi perfil',
    //canActivate: [loginActivateGuard],
    loadComponent: () =>
      import('./profile.component').then((m) => m.ProfileComponent),
  },

  {
    path: ':id',
    title: 'Perfil Usuario',
    //canActivate: [loginActivateGuard],
    loadComponent: () =>
      import('./profile.component').then((m) => m.ProfileComponent),
  },
];
