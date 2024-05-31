import { Pipe, PipeTransform } from '@angular/core';
import { Videojuego } from "../interfaces/videojuego";

@Pipe({
  name: 'filtroFechaPrecio',
  standalone: true

})
export class FiltroFechaPrecioPipe implements PipeTransform {

    transform(videojuegos: Videojuego[], filter: string): Videojuego[] {
        if (filter === 'none') {
          return videojuegos; 
        }
      
        const filteredGames = videojuegos.slice(); 
      
        switch (filter) {
          case 'date':
            filteredGames.sort((a, b) => b.lanzamiento - a.lanzamiento);
            break;
          case '-date':
            filteredGames.sort((a, b) => a.lanzamiento - b.lanzamiento); 
            break;
          case 'price':
            filteredGames.sort((a, b) => a.precio - b.precio); 
            break;
          case '-price':
            filteredGames.sort((a, b) => b.precio - a.precio); 
            break;
        }
      
        return filteredGames;
      }
      
}
