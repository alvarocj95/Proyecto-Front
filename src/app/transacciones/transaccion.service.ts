import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, map } from "rxjs";
import { TransaccionResponse, TransaccionesResponse } from "./interfaces/responses";
import { Transaccion } from "./interfaces/transaccion";

@Injectable({
    providedIn: 'root'
})
export class TransaccionService{
 #http = inject(HttpClient);
 
 nuevaTransaccion(idArticulo: string, idComprador: string, idVendedor: string): Observable<TransaccionResponse> {
    return this.#http.post<TransaccionResponse>(`transacciones`, {
      idArticulo,
      idComprador,
      idVendedor
    });
  }

//   getTransacciones(): Observable<Transaccion[]> {
//     return this.#http
//       .get<TransaccionesResponse>(`transacciones`)
//       .pipe(map((response) => response.transacciones));
//   }

  getTransacciones(idUsuario: string): Observable<Transaccion[]> {
    return this.#http
      .get<TransaccionesResponse>(`transacciones/${idUsuario}`)
      .pipe(map((response) => response.transacciones));
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
}