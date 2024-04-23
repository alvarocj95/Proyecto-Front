import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth', 
    title: 'Login',
    loadChildren: () => import('./auth/auth.routes').then(m => m.routesAuth)
  },
  {
    path: 'videojuegos',
    title: 'Videojuegos',
    loadChildren() {
      return import('./videojuegos/videojuegos.routes').then(
        (m) => m.videojuegoRoutes
      );
    },
  },
  {
    path: 'avisolegal',
    title: 'Aviso legal',
    loadComponent() {
      return import('./avisolegal/avisolegal.component').then(
        (m) => m.AvisolegalComponent
      );
    },
  },
  {
    path: 'contacto',
    title: 'Contacto',
    loadComponent() {
      return import('./contacto/contacto.component').then(
        (m) => m.ContactoComponent
      );
    },
  },
  {
    path: 'sobrenosotros',
    title: 'Sobre nosotros',
    loadComponent() {
      return import('./sobrenosotros/sobrenosotros.component').then(
        (m) => m.SobrenosotrosComponent
      );
    },
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.routes').then((m) => m.profileroutes),
  },
  {
    path: 'likes',
    title: 'Mi lista de deseos',
    loadComponent() {
      return import('./likes/likes.component').then(
        (m) => m.LikesComponent
      );
    },
  },
  { path: '', pathMatch: 'full', redirectTo: '/auth/login' },
  // ...
  { path: '**', redirectTo: '/auth/login' },
 
];
