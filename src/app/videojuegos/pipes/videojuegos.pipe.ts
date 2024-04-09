import { Pipe, PipeTransform } from "@angular/core";
import { Videojuego } from "../interfaces/videojuego";

@Pipe({
    name : 'videoJuegosFilter', 
    standalone: true
})
export class videojuegoFilterPipe implements PipeTransform{
    transform(videojuegos: Videojuego[], search: string): Videojuego[] {
        if (!search) return videojuegos;
        return videojuegos.filter((p) =>
          p.titulo!.toLowerCase().includes(search.toLowerCase())
        );
      }
}