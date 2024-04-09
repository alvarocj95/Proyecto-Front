import { Component, Input, OnInit, inject } from '@angular/core';
import { Videojuego } from '../interfaces/videojuego';
import { VideojuegoService } from '../services/videojuego.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Usuario } from '../../auth/interfaces/usuarios';
import { ProfileService } from '../../profile/services/profile.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit{
  @Input() videojuego !: Videojuego;
  usuario!: Usuario;
  #profileService = inject(ProfileService);

  ngOnInit(): void {
    this.#profileService.getPerfil(this.videojuego.idUsuario).subscribe({
      next: (user) => {
        this.usuario = user.resultado;
      }
    })
  }
}
