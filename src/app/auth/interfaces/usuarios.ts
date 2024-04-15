export interface Usuario {
    _id: string;
    nombre: string;
    email: string;
    password: string;
    imagen: string;
    valoracion: number;
    __v: string;
    plan: string;
    saldo: number;
}
export interface UsuarioRegistro {
    nombre?: string;
    email?: string;
    password?: string;
    imagen?: string;
    plan?: string;
}
export interface UsuarioLogin{
    nombre: string;
    password: string;
}

