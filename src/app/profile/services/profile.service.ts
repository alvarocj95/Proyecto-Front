import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, map } from "rxjs";
import { UsuarioResponse } from "../../auth/interfaces/responses";
import { Usuario } from "../../auth/interfaces/usuarios";

@Injectable({
    providedIn: 'root'
})
export class ProfileService{
 #http = inject(HttpClient);
 #usuariosUrl = 'usuarios';
 
 getPerfil(id: string): Observable<UsuarioResponse> {
    return this.#http.get<UsuarioResponse>(`${this.#usuariosUrl}/${id}`);
  }

  getMiPerfil(): Observable<UsuarioResponse> {
    return this.#http.get<UsuarioResponse>(`${this.#usuariosUrl}/me`);
  }

  changeRating(idUser: string, rating: number): Observable<void> {
    return this.#http.put<void>(`${this.#usuariosUrl}/${idUser}/rating`, {
      rating,
    });
  }

  actualizarSaldo(idUser: string, nuevoSaldo: number): Observable<void> {
    return this.#http.put<void>(`${this.#usuariosUrl}/${idUser}/saldo`, { nuevoSaldo });
  }
  
  // mapToUsuario(resultado: any): Usuario {
  //   return {
  //     _id: resultado._id,
  //     nombre: resultado.nombre,
  //     email: resultado.email,
  //     password: resultado.password,
  //     imagen: resultado.imagen,
  //     __v: resultado.__v
  //   };
  // }
}
//  editProfile(name: UserProfileEdit): Observable<void> {
//    return this.#http.put<void>(`users/me`, name);
//  }

//  editPassword(password: UserPasswordEdit): Observable<void> {
//   return this.#http.put<void>(`users/me/password`, password);
// }
//  editAvatar(avatar: UserAvatarEdit): Observable<void> {
//    return this.#http.put<void>(`users/me/avatar`, avatar);
//  }
