import { Usuario } from "./usuarios";


export interface TokenResponse {
    accessToken: string;
}

export interface UsuarioResponse {
    resultado: Usuario;
}

export interface UsuariosRespone {
    usuarios: Usuario[];
}



