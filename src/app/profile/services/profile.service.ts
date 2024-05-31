import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, map } from "rxjs";
import { ImagenResponse, UsuarioResponse, UsuariosRespone } from "../../auth/interfaces/responses";
import { Usuario } from "../../auth/interfaces/usuarios";

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

  actualizarSaldo(idUser: string, nuevoSaldo: number): Observable<void> {
    return this.#http.put<void>(`${this.#usuariosUrl}/${idUser}/saldo`, { nuevoSaldo });
  }

}

