import { Usuario } from "../../auth/interfaces/usuarios";
import { Videojuego } from "../../videojuegos/interfaces/videojuego";

export interface Transaccion{
    _id: string;
    idArticulo: Videojuego;
    idComprador: Usuario;
    idVendedor: Usuario;
    fecha: Date;
    okComprador: boolean;
    okVendedor: boolean;
    estado: 'Pendiente' | 'Aceptada' | 'Rechazada' | 'Finalizada';
    finalComprador: Usuario;
    finalVendedor: Usuario;
    propuesta: number;
}


