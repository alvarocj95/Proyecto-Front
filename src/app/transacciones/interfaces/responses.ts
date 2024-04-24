import { Transaccion } from "./transaccion";

export interface TransaccionResponse {
    transaccion: Transaccion;
}

export interface TransaccionesResponse {
    transacciones: Transaccion[];
}

export interface TransaccionTotal {
    totalTransacciones: number
}