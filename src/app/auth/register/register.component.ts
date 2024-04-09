import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioRegistro } from '../interfaces/usuarios';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  #router = inject(Router);
  #authService = inject(AuthService);
  #fb = inject(NonNullableFormBuilder);

  imageBase64?: string;

  nombre = this.#fb.control('', Validators.required);
  email = this.#fb.control('', [Validators.required, Validators.email]);
  password = this.#fb.control('',[Validators.required, Validators.minLength(4)])
  imagen = this.#fb.control('');

  formGroup = this.#fb.group({
    nombre: this.nombre,
    email: this.email,
    password: this.password,
    imagen: this.imagen
  });

  changeImage(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) return;
    const reader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.addEventListener('loadend', () => {
      this.imageBase64 = reader.result as string;
    });
  }

  register(){
    const usuario: UsuarioRegistro = {
      nombre: this.formGroup.value.nombre,
      email: this.formGroup.value.email,
      password: this.formGroup.value.password,
      imagen: ''
    }

    this.#authService.registro(usuario).subscribe({
      next: () => {
        this.#router.navigate(['/auth']);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
