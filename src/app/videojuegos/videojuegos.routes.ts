import { Routes } from '@angular/router';
import { VideojuegoResolver } from './resolvers/videojuego.resolver';
import { numericIdGuard } from '../guards/numeric-id.guard';
import { leavePageGuard } from '../guards/leave-page.guard';
import { loginActivateGuard } from '../guards/login-activate.guard';

export const videojuegoRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./lista/lista.component').then((m) => m.ListaComponent),
  },
 
  {
    path: 'nuevo',
    canActivate: [loginActivateGuard],
    canDeactivate: [leavePageGuard],
    title: 'Nuevo Videojuego',
    loadComponent: () =>
      import('./nuevo/nuevo.component').then((m) => m.NuevoComponent),
  },
  {
    path: ':id',
    title: 'Detalles Videojuego',
    resolve: { videojuego: VideojuegoResolver },
    loadComponent: () =>
      import('./detalles/detalles.component').then((m) => m.DetallesComponent),
  },
];
