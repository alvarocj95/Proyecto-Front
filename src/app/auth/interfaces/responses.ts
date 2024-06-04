import { Usuario } from "./usuarios";


export interface TokenResponse {
    accessToken: string;
}

export interface UsuarioResponse {
    resultado: Usuario;
}

export interface ImagenResponse {
    imagen: string;
}

export interface UsuariosRespone {
    usuarios: Usuario[];
}

export interface TarjetasResponse {
    tarjetas: Tarjeta[];
}

export interface Tarjeta{
   idUsuario: string; 
   numero: string | undefined,
   cvv: string | undefined,
   mes: string | undefined,
   anyo: string | undefined 
}


