import { ResolveFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { Videojuego } from '../interfaces/videojuego';
import { VideojuegoService } from '../services/videojuego.service';

export const VideojuegoResolver: ResolveFn<Videojuego> = (route) => {
  return inject(VideojuegoService)
    .getVideoJuego(route.params['id'])
    .pipe(
      catchError(() => {
        inject(Router).navigate(['/videojuegos']);
        return EMPTY;
      })
    );
};
