import { Component, Input, OnInit, computed, inject } from '@angular/core';
import { Videojuego } from '../interfaces/videojuego';
import { VideojuegoService } from '../services/videojuego.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Usuario } from '../../auth/interfaces/usuarios';
import { ProfileService } from '../../profile/services/profile.service';
import { AuthService } from '../../auth/services/auth.service';
import { LikesService } from '../../likes/likes.service';
import { Like } from '../../likes/interfaces/likes';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit{
  @Input() videojuego !: Videojuego;
  usuario!: Usuario;
  usuarioLogueado!: Usuario;
  #profileService = inject(ProfileService);
  #authService = inject(AuthService);
  #likesService = inject(LikesService);
  logged = computed(() => this.#authService.logged());
  heartIcon: any;
  likes: Like[] = [];
  liked: boolean = false;
  #router = inject(Router);

  nuevoLike(){
    if (this.videojuego && this.usuarioLogueado) {
      this.#likesService.nuevoLike(this.videojuego._id, this.usuarioLogueado._id).subscribe({
        next: (like) => {
          console.log(like);
          this.ngOnInit();
        }
      });
    }
  }
  
  quitarLike(){
    if (this.videojuego && this.usuarioLogueado) {
      this.#likesService.borrarLike(this.videojuego._id, this.usuarioLogueado._id).subscribe({
        next: (like) => {
          console.log(like);
          this.liked = false;
          this.ngOnInit();
        }
      });
    }
  }
  
  ngOnInit(): void {
    this.#profileService.getMiPerfil().subscribe({
      next: (user) => {
        if (user && user.resultado) {
          this.usuarioLogueado = user.resultado;
          this.#likesService.getLikes(this.usuarioLogueado?._id).subscribe({
            next: (likes) => {
              this.likes = likes;
              this.likes.forEach(like => {
                if (like.idArticulo && like.idArticulo._id === this.videojuego._id) {
                  this.liked = true;
                }
              });
            }
          });
        }
      }
    });
  }
  
}
