import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, map } from "rxjs";
import { LikeResponse, LikesResponse, LikesTotal } from "./interfaces/responses";
import { Like } from "./interfaces/likes";


@Injectable({
    providedIn: 'root'
})
export class LikesService{
 #http = inject(HttpClient);
 
 nuevoLike(idArticulo: string, idUsuario: string): Observable<LikeResponse> {
    return this.#http.post<LikeResponse>(`likes`, {
      idArticulo,
      idUsuario
    });
  }

  getLikes(idUsuario: string): Observable<Like[]> {
    return this.#http
      .get<LikesResponse>(`likes/${idUsuario}`)
      .pipe(map((response) => response.likes));
  }

  getTotalLikes(idArticulo: string): Observable<number> {
    return this.#http
      .get<LikesTotal>(`likes/${idArticulo}/total`)
      .pipe(map((response) => response.totalLikes));
  }

  borrarLike(idArticulo: string, idUsuario: string): Observable<LikeResponse> {
    return this.#http.delete<LikeResponse>(`likes/${idArticulo}/${idUsuario}`);
  }
}