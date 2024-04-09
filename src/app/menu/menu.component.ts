import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { routes } from '../app.routes';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/services/auth.service';


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
 
  logged = computed(() => this.#authService.logged());


searchVideojuego() {
  this.#router.navigate(['/videojuegos'], { queryParams: { search: this.search } });
}


}
