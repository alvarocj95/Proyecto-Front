import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario, UsuarioRegistro } from '../interfaces/usuarios';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ProfileService } from '../../profile/services/profile.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  #router = inject(Router);
  #authService = inject(AuthService);
  #profileService = inject(ProfileService);
  #fb = inject(NonNullableFormBuilder);
  usuarios: Usuario[] = [];
  usuarioExistente = false;
  imageBase64?: string;

  nombre = this.#fb.control('', [Validators.required, Validators.minLength(4)]);
  email = this.#fb.control('', [Validators.required, Validators.email]);
  password = this.#fb.control('',[Validators.required, Validators.minLength(4)])
  imagen = this.#fb.control('', Validators.required);
  plan = this.#fb.control('Básico');


  formGroup = this.#fb.group({
    nombre: this.nombre,
    email: this.email,
    password: this.password,
    imagen: this.imagen,
    plan: this.plan

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

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(){
    this.#profileService.getUsuarios().subscribe({
      next: (resp) => {
        this.usuarios = resp.usuarios;
      }
    })
  }


   register() {
    const usuario: UsuarioRegistro = {
      nombre: this.formGroup.value.nombre,
      email: this.formGroup.value.email,
      password: this.formGroup.value.password,
      imagen: this.imageBase64,
      plan: this.formGroup.value.plan
    };
  
    try {
      const existingUser =  this.checkForExistingUser(usuario.nombre, usuario.email);
      if (existingUser) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'El usuario ya existe',
        });
        return; 
      }
  
      this.#authService.registro(usuario).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Se ha registrado correctamente',
            text: 'Redirigiendo a login...',
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true
          }).then(() => {
            this.#router.navigate(['/auth/login']);
          });

        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Error del servidor',
          });
        }
      });
    } catch (error) {
      console.error('Error checking for existing user:', error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error al registrarse',
      });
    }
  }
   checkForExistingUser(nombre: string | undefined, email: string | undefined): Usuario | null {
      const existingUser = this.usuarios.find(user => user.nombre.toLowerCase() === nombre?.toLowerCase() || user.email.toLowerCase() === email?.toLowerCase());
      return existingUser || null;
  }
  

  cambiarPlan(event: Event) :void{
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.plan.setValue(String(selectedValue));
  }
}
