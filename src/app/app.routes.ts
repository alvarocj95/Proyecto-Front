import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth', 
    title: 'Bienvenidos a RetroGaming',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.routesAuth)
  },
  {
    path: 'videojuegos',
    title: 'Videojuegos',
    loadChildren: () => import('./videojuegos/videojuegos.routes').then((m) => m.videojuegoRoutes)
  },
  {
    path: 'juegos',
    title: 'Juegos',
    loadComponent: () =>
      import('./videojuegos/juegos/juegos.component').then((m) => m.JuegosComponent),
  },
  {
    path: 'consolas',
    title: 'Consolas',
    loadComponent: () =>
      import('./videojuegos/consolas/consolas.component').then((m) => m.ConsolasComponent),
  },
  {
    path: 'avisolegal',
    title: 'Aviso legal',
    loadComponent: () => import('./avisolegal/avisolegal.component').then((m) => m.AvisolegalComponent),
  },
  {
    path: 'contacto',
    title: 'Contacto',
    loadComponent: () => import('./contacto/contacto.component').then((m) => m.ContactoComponent),
  },
  {
    path: 'sobrenosotros',
    title: 'Sobre nosotros',
    loadComponent: () => import('./sobrenosotros/sobrenosotros.component').then((m) => m.SobrenosotrosComponent),
  },
  {
    path: 'profile',
    loadChildren: () =>
      import('./profile/profile.routes').then((m) => m.profileroutes),
  },
  {
    path: 'likes',
    title: 'Mi lista de deseos',
    loadComponent: () => import('./likes/likes.component').then((m) => m.LikesComponent),
  },
  { path: '', pathMatch: 'full', redirectTo: '/auth/login' },

  { path: '**', redirectTo: '/auth/login' },
 
];
