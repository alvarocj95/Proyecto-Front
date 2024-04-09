import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Videojuego } from '../interfaces/videojuego';
import { VideojuegoService } from '../services/videojuego.service';
import { CardComponent } from "../card/card.component";

@Component({
    selector: 'app-consolas',
    standalone: true,
    templateUrl: './consolas.component.html',
    styleUrl: './consolas.component.css',
    imports: [CardComponent]
})
export class ConsolasComponent {
  videojuegos: Videojuego[] = [];
  #videoJuegoService = inject(VideojuegoService);
  
  search = '';
  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['search']) {
        console.log(params['search']);
        this.search = params['search'];
        this.filterVideojuegos();
      } else {
        this.loadAllVideojuegos();
      }
    });
  }
  
  filterVideojuegos() {
    this.#videoJuegoService.getVideojuegos().subscribe((videojuegos) => {
      this.videojuegos = videojuegos.filter((videojuego) =>
        videojuego.titulo.toLowerCase().includes(this.search.toLowerCase())
      );
    });
  }
  
  loadAllVideojuegos() {
    this.#videoJuegoService.getVideojuegos().subscribe((videojuegos) => {
      this.videojuegos = videojuegos;
    });
  }
}