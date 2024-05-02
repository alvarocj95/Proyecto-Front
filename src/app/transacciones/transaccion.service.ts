import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, map } from "rxjs";
import { TransaccionResponse, TransaccionTotal, TransaccionesResponse } from "./interfaces/responses";
import { Transaccion } from "./interfaces/transaccion";

@Injectable({
    providedIn: 'root'
})
export class TransaccionService{
 #http = inject(HttpClient);
 
 nuevaTransaccion(idArticulo: string, idComprador: string, idVendedor: string, propuesta: number): Observable<TransaccionResponse> {
    return this.#http.post<TransaccionResponse>(`transacciones`, {
      idArticulo,
      idComprador,
      idVendedor,
      propuesta
    });
  }

//   getTransacciones(): Observable<Transaccion[]> {
//     return this.#http
//       .get<TransaccionesResponse>(`transacciones`)
//       .pipe(map((response) => response.transacciones));
//   }

 getTodasTransacciones(): Observable<Transaccion[]> {
   return this.#http
     .get<TransaccionesResponse>(`transacciones`)
     .pipe(map((response) => response.transacciones));
 }
  getTransacciones(idUsuario: string): Observable<Transaccion[]> {
    return this.#http
      .get<TransaccionesResponse>(`transacciones/${idUsuario}`)
      .pipe(map((response) => response.transacciones));
  }
  getTransaccionesFinalizadas(idUsuario: string): Observable<Transaccion[]> {
    return this.#http
      .get<TransaccionesResponse>(`transacciones/${idUsuario}/finalizadas`)
      .pipe(map((response) => response.transacciones));
  
  }
  getArticuloTransaccion(idArticulo: string): Observable<Transaccion> {
    return this.#http
      .get<TransaccionResponse>(`transacciones/${idArticulo}/articulo`)
      .pipe(map((response) => response.transaccion));
  }
  getTotalTransacciones(idArticulo: string): Observable<number> {
    return this.#http
      .get<TransaccionTotal>(`transacciones/${idArticulo}/total`)
      .pipe(map((response) => response.totalTransacciones));
  }


  aceptarTransaccion(idTransaccion: string) {
    return this.#http.post<TransaccionResponse>(`transacciones/${idTransaccion}/true`, {
      okVendedor: true
    });
  }

  rechazarTransaccion(idTransaccion: string) {
    return this.#http.post<TransaccionResponse>(`transacciones/${idTransaccion}/false`, {
      okVendedor: false
    });
  }

  finalizarTransaccion(idTransaccion: string, idComprador: string, idVendedor: string) {
    return this.#http.post<TransaccionResponse>(`transacciones/${idTransaccion}/${idComprador}/${idVendedor}/finalizar`, {
    });
  }
}