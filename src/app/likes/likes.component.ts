import { Component, OnInit, inject } from '@angular/core';
import { Usuario } from '../auth/interfaces/usuarios';
import { ProfileService } from '../profile/services/profile.service';
import { LikesService } from './likes.service';
import { Like } from './interfaces/likes';
import { CardComponent } from '../videojuegos/card/card.component';

@Component({
  selector: 'app-likes',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './likes.component.html',
  styleUrl: './likes.component.css'
})
export class LikesComponent implements OnInit{

  #profileService = inject(ProfileService);
  #likesService = inject(LikesService);
  usuario!: Usuario;
  likes!: Like[];
  ngOnInit(): void {
    this.#profileService.getMiPerfil().subscribe({
      next: (user) => {
        this.usuario = user.resultado;
        this.#likesService.getLikes(this.usuario._id).subscribe({
          next: (likes) => {
            this.likes = likes;
          }
        })
      }
    })
  }
}
