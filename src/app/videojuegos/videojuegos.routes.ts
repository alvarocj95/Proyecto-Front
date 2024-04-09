import { Routes } from '@angular/router';

export const videojuegoRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./lista/lista.component').then((m) => m.ListaComponent),
  },
  {
    path: 'juegos',
    title: 'Juegos',
    loadComponent: () =>
      import('./juegos/juegos.component').then((m) => m.JuegosComponent),
  },
  {
    path: 'consolas',
    title: 'Consolas',
    loadComponent: () =>
      import('./consolas/consolas.component').then((m) => m.ConsolasComponent),
  },
  {
    path: 'nuevo',
    title: 'Nuevo Videojuego',
    loadComponent: () =>
      import('./nuevo/nuevo.component').then((m) => m.NuevoComponent),
  },
  {
    path: ':id',
    title: 'Detalles Videojuego',
    loadComponent: () =>
      import('./detalles/detalles.component').then((m) => m.DetallesComponent),
  },
];
