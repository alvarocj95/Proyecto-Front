import { Component, Input, OnInit, inject, input } from '@angular/core';
import { Videojuego } from '../interfaces/videojuego';
import { CardComponent } from '../card/card.component';
import { VideojuegoService } from '../services/videojuego.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { videojuegoFilterPipe } from '../pipes/videojuegos.pipe';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [CardComponent,FormsModule, CommonModule, videojuegoFilterPipe],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.css'
})
export class ListaComponent implements OnInit{
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

  searchVideojuego() {
    this.route.queryParams.subscribe((params) => {
      if (params['search']) {
        console.log(params['search']);
        this.search = params['search'];
        this.filterVideojuegos();
      }
    });
  }
  
}
