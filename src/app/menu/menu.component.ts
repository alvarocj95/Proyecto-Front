import { Component, OnChanges, OnInit, computed, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { routes } from '../app.routes';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/services/auth.service';
import { ProfileService } from '../profile/services/profile.service';
import { Usuario } from '../auth/interfaces/usuarios';


@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink, FormsModule, RouterLink, RouterLinkActive, RouterOutlet, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {
  search = '';
  #router = inject(Router);
  #authService = inject(AuthService);
  #profileService = inject(ProfileService);
  usuarioLogueado!: Usuario;
  darkMode = false;
 
  logged = computed(() => this.#authService.logged());

  

searchVideojuego() {
  this.#router.navigate(['/videojuegos'], { queryParams: { search: this.search } });
}

constructor() {
  effect(() => {
    if(this.logged()){
      this.#profileService.getMiPerfil().subscribe({
        next: (resp) => {
          this.usuarioLogueado = resp.resultado;
          this.#profileService.getImagenPerfil(this.usuarioLogueado._id).subscribe({
            next: (resp) => {
              this.usuarioLogueado.imagen = resp.imagen;
            }
          })
        }
      })
    }
  })
}

}
