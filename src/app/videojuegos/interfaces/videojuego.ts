export interface Videojuego {
    idUsuario: string; 
    _id: string;
    titulo: string;
    descripcion: string;
    lanzamiento: number;
    precio: number;
    estado?: 'Precintado' | 'Como nuevo' | 'Usado' | 'Mal estado'; 
    tipo: 'Consola' | 'Juego';
    imagenPrincipal: string;
    imagenSecundaria?: string;
    imagenTerciaria?: string;
    imagenCuaternaria?: string;
    vendido?: boolean;
    plataforma: string;
    compania?: string;

}

export interface VideojuegoNuevo{
    idUsuario?: string; 
    titulo: string;
    descripcion: string;
    lanzamiento: number;
    precio: number;
    estado: string; 
    tipo: string;
    imagenPrincipal: string;
    imagenSecundaria?: string;
    imagenTerciaria?: string;
    imagenCuaternaria?: string;
    plataforma?: string;
    compania?: string;
    
}

