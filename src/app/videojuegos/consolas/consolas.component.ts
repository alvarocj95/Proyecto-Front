import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Videojuego } from '../interfaces/videojuego';
import { VideojuegoService } from '../services/videojuego.service';
import { CardComponent } from "../card/card.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { filtroPipe } from '../pipes/filtro.pipe';
import { FiltroFechaPrecioPipe } from '../pipes/filtroFechaPrecio';
import { videojuegoFilterPipe } from '../pipes/videojuegos.pipe';

@Component({
    selector: 'app-consolas',
    standalone: true,
    templateUrl: './consolas.component.html',
    styleUrl: './consolas.component.css',
    imports: [CardComponent, FormsModule, CommonModule, videojuegoFilterPipe, filtroPipe, FiltroFechaPrecioPipe, FormsModule],
})
export class ConsolasComponent {
  videojuegos: Videojuego[] = [];
  #videoJuegoService = inject(VideojuegoService);
  
  search = '';
  constructor(private route: ActivatedRoute) { }
  selectedFilter: string = 'none'; 
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
      this.videojuegos.reverse();
    });
  }

  parentSelector: boolean = false;
  Plataformas: { id: number, name: string, select: boolean }[] = [
    {id : 1, name: 'Switch', select: false},
    {id : 2, name: 'Wii U', select: false},
    {id : 3, name: '3DS', select: false},
    {id : 4, name: 'GameCube', select: false},
    {id : 5, name: 'N64', select: false},
    {id : 6, name: 'NES', select: false},
    {id : 7, name: 'GBA', select: false},
    {id : 8, name: 'GBC', select: false},
    {id : 9, name: 'GB', select: false},
    {id : 10, name: 'PS5', select: false},
    {id : 11, name: 'PS4', select: false},
    {id : 12, name: 'PS3', select: false},
    {id : 13, name: 'PS2', select: false},
    {id : 14, name: 'PS1', select: false},
    {id : 15, name: 'PSP', select: false},
    {id : 16, name: 'PSVita', select: false},
    {id : 17, name: 'Series X/S', select: false},
    {id : 18, name: 'One', select: false},
    {id : 19, name: '360', select: false},
    {id : 20, name: 'Original', select: false},
    {id : 21, name: 'Windows', select: false},
    {id : 22, name: 'Mac', select: false},
    {id : 23, name: 'Linux', select: false},
    {id : 24, name: 'SEGA', select: false},
    {id : 25, name: 'Atari', select: false},
    {id : 26, name: 'Neo Geo', select: false},
  ]
  


  searchVideojuego() {
    this.route.queryParams.subscribe((params) => {
      if (params['search']) {
        console.log(params['search']);
        this.search = params['search'];
        this.filterVideojuegos();
      }
    });
  }

  filtrarPlataformas($event: Event) {
    const id = ($event.target as HTMLInputElement).value;
    const selected = ($event.target as HTMLInputElement).checked;
    this.Plataformas = this.Plataformas.map(plataforma => {
      if (plataforma.id === Number(id)) {
        return { ...plataforma, select: selected };
      } else {
        return plataforma;
      }
    });
    console.log('Plataformas seleccionadas:', this.Plataformas.filter(p => p.select));
  }

  onFilterChange() {
    if (this.selectedFilter === 'none') {
      return;
    }

    const filteredGames = this.videojuegos.slice();

    switch (this.selectedFilter) {
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
  }
}
