import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, map } from "rxjs";
import { ImagenResponse, Tarjeta, TarjetasResponse, UsuarioResponse, UsuariosRespone } from "../../auth/interfaces/responses";
import { UserPasswordEdit, Usuario } from "../../auth/interfaces/usuarios";

@Injectable({
    providedIn: 'root'
})
export class ProfileService{
  
 #http = inject(HttpClient);
 #usuariosUrl = 'usuarios';

getUsuarios(): Observable<UsuariosRespone> {
  return this.#http.get<UsuariosRespone>(`${this.#usuariosUrl}/todos`);
}
 getPerfil(id: string): Observable<UsuarioResponse> {
    return this.#http.get<UsuarioResponse>(`${this.#usuariosUrl}/${id}`);
  }

  getMiPerfil(): Observable<UsuarioResponse> {
    return this.#http.get<UsuarioResponse>(`${this.#usuariosUrl}/me`);
  }

  getImagenPerfil(id: string): Observable<ImagenResponse> {
    return this.#http.get<ImagenResponse>(`${this.#usuariosUrl}/${id}/imagen`);
  }

  changeRating(idUser: string, rating: number): Observable<void> {
    return this.#http.put<void>(`${this.#usuariosUrl}/${idUser}/rating`, {
      rating,
    });
  }

  actualizarSaldo(idUser: string, nuevoSaldo: number): Observable<string> {
    return this.#http.put<string>(`${this.#usuariosUrl}/${idUser}/saldo`, { nuevoSaldo });
  }

  editPassword(idUser: string, password: string): Observable<void> {
    return this.#http.put<void>(`${this.#usuariosUrl}/${idUser}/password`, {password});
  }

  editNombre(idUser: string, nuevoNombre: string): Observable<void> {
    return this.#http.post<void>(`${this.#usuariosUrl}/${idUser}/nombre`, {nuevoNombre});
  }

  anadirTarjeta(idUser: string, nuevaTarjeta: Tarjeta): Observable<void> {
    return this.#http.put<void>(`${this.#usuariosUrl}/${idUser}/nuevaTarjeta`, {nuevaTarjeta});
  }

  getTarjetas(idUser: string): Observable<TarjetasResponse> {
    return this.#http.get<TarjetasResponse>(`${this.#usuariosUrl}/${idUser}/tarjetas`);
  }
}

