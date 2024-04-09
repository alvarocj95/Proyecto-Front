import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLinkActive } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UsuarioLogin } from '../interfaces/usuarios';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLinkActive],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  #router = inject(Router);
  #authService = inject(AuthService);
  #fb = inject(NonNullableFormBuilder);

  nombre = this.#fb.control('', [Validators.required]);
  password = this.#fb.control('',[Validators.required, Validators.minLength(4)]);

  formGroup = this.#fb.group({
    nombre: this.nombre,
    password: this.password
  });

  
  login(){
    const usuario: UsuarioLogin = {
      nombre: this.nombre.value,
      password: this.password.value
    }
    this.#authService.login(usuario).subscribe({
      next: () => {
        this.#router.navigate(['/videojuegos']);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
