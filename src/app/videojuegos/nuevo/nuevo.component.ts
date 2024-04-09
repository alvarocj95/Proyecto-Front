import { Component, OnInit, inject } from '@angular/core';
import { AbstractControl, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { VideojuegoService } from '../services/videojuego.service';
import { VideojuegoNuevo } from '../interfaces/videojuego';
import { Router } from '@angular/router';
import { Usuario } from '../../auth/interfaces/usuarios';
import { ProfileService } from '../../profile/services/profile.service';

@Component({
  selector: 'app-nuevo',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './nuevo.component.html',
  styleUrl: './nuevo.component.css'
})
export class NuevoComponent implements OnInit{
  constructor() {
    this.resetForm();
  }
  #fb = inject(NonNullableFormBuilder);
  #videoJuegoService = inject(VideojuegoService);
  #router = inject(Router);
  #profileService = inject(ProfileService);
  usuario!: Usuario;


  titulo = this.#fb.control('', [Validators.minLength(10)]);
  descripcion = this.#fb.control('', [Validators.minLength(20)]);
  lanzamiento = this.#fb.control(2024);
  precio = this.#fb.control(0);
  estado = this.#fb.control('Precintado');
  tipo = this.#fb.control('Consola');
  imagen = this.#fb.control('');
  imagen2 = this.#fb.control('');
  imagen3 = this.#fb.control('');
  imagen4 = this.#fb.control('');
  imageBase64 : string = '';
  image2Base64 : string = '';
  image3Base64 : string = '';
  image4Base64 : string = '';



  form = this.#fb.group({
    titulo: this.titulo,
    descripcion: this.descripcion,
    lanzamiento: this.lanzamiento,
    precio: this.precio,
    estado: this.estado,
    tipo: this.tipo
  },
    {validators: this.formRequired}
  );

  ngOnInit(): void {
    this.#profileService.getMiPerfil().subscribe({
      next: (user) => {
        this.usuario = user.resultado;
      }
    })
  }

  resetForm() {
    this.form.reset();
  }
  formRequired(c: AbstractControl): ValidationErrors | null {
    const titulo = c.get('titulo')?.value;
    const descripcion = c.get('descripcion')?.value;
    const lanzamiento = c.get('lanzamiento')?.value;
    const precio = c.get('precio')?.value;
    const estado = c.get('estado')?.value;
    const tipo = c.get('tipo')?.value;
    

    if (!titulo && !descripcion && !lanzamiento && !precio && !estado && !tipo) {
      return { formRequired: true };
    }

    return null;
  }

  cambiarEstado(event: Event) :void{
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.estado.setValue(String(selectedValue));
  }

  cambiarTipo(event: Event) :void{
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.tipo.setValue(String(selectedValue));
  }

  subirVideojuego() {
    
    const videojuego: VideojuegoNuevo = {
      idUsuario: this.usuario._id,
      titulo: this.titulo.value,
      descripcion: this.descripcion.value,
      lanzamiento: this.lanzamiento.value,
      precio: this.precio.value,
      estado: this.estado.value,
      tipo: this.tipo.value,
      imagenPrincipal: this.imageBase64,
      imagenSecundaria: this.image2Base64,
      imagenTerciaria: this.image3Base64,
      imagenCuaternaria: this.image4Base64
    };
    this.#videoJuegoService
    .nuevoVideojuego(videojuego)
    .subscribe({
      next: (videojuego) => {
        this.#router.navigate(['/videojuegos']);
        this.resetForm();
      },
      error: (error) => {
        console.error('Error al crear el videojuego:', error);
        console.log(videojuego);
      }
    });
    
    }
    changeImage(event: Event) {
      const fileInput = event.target as HTMLInputElement;
      if (!fileInput.files || fileInput.files.length === 0) return;
      const reader = new FileReader();
      reader.readAsDataURL(fileInput.files[0]);
      reader.addEventListener('loadend', () => {
        this.imageBase64 = reader.result as string;
      });
    }
    changeImage2(event: Event) {
      const fileInput = event.target as HTMLInputElement;
      if (!fileInput.files || fileInput.files.length === 0) return;
      const reader = new FileReader();
      reader.readAsDataURL(fileInput.files[0]);
      reader.addEventListener('loadend', () => {
        this.image2Base64 = reader.result as string;
      });
    }
    changeImage3(event: Event) {
      const fileInput = event.target as HTMLInputElement;
      if (!fileInput.files || fileInput.files.length === 0) return;
      const reader = new FileReader();
      reader.readAsDataURL(fileInput.files[0]);
      reader.addEventListener('loadend', () => {
        this.image3Base64 = reader.result as string;
      });
    }
    changeImage4(event: Event) {
      const fileInput = event.target as HTMLInputElement;
      if (!fileInput.files || fileInput.files.length === 0) return;
      const reader = new FileReader();
      reader.readAsDataURL(fileInput.files[0]);
      reader.addEventListener('loadend', () => {
        this.image4Base64 = reader.result as string;
      });
    }


    
  }

