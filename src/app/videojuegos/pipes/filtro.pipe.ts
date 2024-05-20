import { Pipe, PipeTransform } from "@angular/core";
import { Videojuego } from "../interfaces/videojuego";

@Pipe({
    name : 'filtroPipe', 
    standalone: true
})
export class filtroPipe implements PipeTransform{
    transform(videojuegos: Videojuego[], plataformas: { id: number, name: string, select: boolean }[]): Videojuego[] {
        console.log(plataformas);
        if (!plataformas || plataformas.length === 0) {
          return videojuegos;
        }
        
        const plataformasSeleccionadas = plataformas
          .filter(p => p.select)
          .map(p => p.name);
    
        if (plataformasSeleccionadas.length === 0) {
          return videojuegos;
        }
    
        return videojuegos.filter(videojuego =>
          plataformasSeleccionadas.some(platform =>
            videojuego.plataforma! === platform
        
          )
        );
    
      }
}