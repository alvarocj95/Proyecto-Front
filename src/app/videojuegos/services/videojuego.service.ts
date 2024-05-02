import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Videojuego, VideojuegoNuevo } from '../interfaces/videojuego';
import {
  VideojuegoResponse,
  VideojuegosResponse,
} from '../interfaces/responses';

@Injectable({
  providedIn: 'root',
})
export class VideojuegoService {
  #http = inject(HttpClient);
  #videoJuegoUrl = 'videojuegos';

  getVideojuegos(): Observable<Videojuego[]> {
    return this.#http
      .get<VideojuegosResponse>(`${this.#videoJuegoUrl}`)
      .pipe(map((response) => response.videojuegos));
  }

  getVideoJuego(id: string): Observable<Videojuego> {
    return this.#http
      .get<VideojuegoResponse>(`${this.#videoJuegoUrl}/${id}`)
      .pipe(map((response) => response.videojuego));
  }

  nuevoVideojuego(videojuego: VideojuegoNuevo): Observable<Videojuego> {
    return this.#http
      .post<VideojuegoResponse>(`${this.#videoJuegoUrl}`, videojuego)
      .pipe(map((response) => response.videojuego));
  }

  getVideojuegosJugador(id: string): Observable<Videojuego[]> {
    return this.#http
      .get<VideojuegosResponse>(`${this.#videoJuegoUrl}/${id}/jugador`)
      .pipe(map((response) => response.videojuegos));
  }

  juegoVendido(idJuego: string) {
    return this.#http.post<VideojuegoResponse>(`videojuegos/${idJuego}/vendido`, {
      vendido: true
    });
  }
}
