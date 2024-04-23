import { Usuario } from "../../auth/interfaces/usuarios";
import { Videojuego } from "../../videojuegos/interfaces/videojuego";

export interface Like{
    _id: string;
    idArticulo: Videojuego;
    idUsuario: Usuario;
    fecha: Date;
   
}


