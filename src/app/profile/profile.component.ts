import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
  computed,
  inject,
  input,
} from '@angular/core';
import { AuthService } from '../auth/services/auth.service';
import { ProfileService } from './services/profile.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserPasswordEdit, Usuario } from '../auth/interfaces/usuarios';
import { Tarjeta, UsuarioResponse } from '../auth/interfaces/responses';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { VideojuegoService } from '../videojuegos/services/videojuego.service';
import { Videojuego } from '../videojuegos/interfaces/videojuego';
import { CardComponent } from '../videojuegos/card/card.component';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { Transaccion } from '../transacciones/interfaces/transaccion';
import { TransaccionService } from '../transacciones/transaccion.service';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AbstractControl, FormControl, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { FiltroTransacciones } from '../videojuegos/pipes/filtroTransacciones';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  imports: [
    RouterLink,
    CommonModule,
    CardComponent,
    StarRatingComponent,
    RouterLink,
    SweetAlert2Module,
    ReactiveFormsModule,
    FormsModule,
    FiltroTransacciones
    
  ],
})
export class ProfileComponent implements OnInit {
 
  constructor(
    private cdr: ChangeDetectorRef,
    // otros servicios inyectados...
  ) {}

  
  #profileService = inject(ProfileService);
  #videojuegoService = inject(VideojuegoService);
  usuario!: Usuario;
  usuarios!: Usuario[];
  @Input() id!: string;
  cookieService = inject(SsrCookieService);
  videoJuegos: Videojuego[] = [];
  logged = computed(() => this.#authService.logged());
  #authService = inject(AuthService);
  #router = inject(Router);
  #transaccionService = inject(TransaccionService);
  transacciones!: Transaccion[];
  tarjetas!: Tarjeta[];
  transaccionesFinalizadas!: Transaccion[];
  transaccionArticulo!: Transaccion;
  #fb = inject(NonNullableFormBuilder);
  password = this.#fb.control('',[Validators.required, Validators.minLength(4)]);  
  password2 = this.#fb.control('',[Validators.required, Validators.minLength(4)]);
  nombreActual = this.#fb.control('', [Validators.required, Validators.minLength(4)]);
  nuevoNombre = this.#fb.control('', [Validators.required, Validators.minLength(4)]);
  saldo = this.#fb.control(1, [Validators.required, Validators.min(1)]);
  numeroTarjeta = this.#fb.control('', [Validators.required, Validators.minLength(14), Validators.maxLength(14)]);
  checkNumeroTarjeta = this.#fb.control('', [Validators.required, Validators.minLength(14), Validators.maxLength(14)]);
  checkCvv = this.#fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]);
  cvv = this.#fb.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]);
  checkMes = this.#fb.control('Enero', [Validators.required, Validators.minLength(2)]);
  mes = this.#fb.control('Enero', [Validators.required, Validators.minLength(2)]);
  checkAnyo = this.#fb.control('2025', [Validators.required, Validators.minLength(2)]);
  anyo = this.#fb.control('2025', [Validators.required, Validators.minLength(2)]);
  activeTab: string = 'compras'; 
  activeTab2: string = 'tarjeta';
  selectedFilter: string = 'none'; 
  tarjetaActiva: any; 


  
  form = this.#fb.group({
    checkCvv: this.checkCvv,
    checkMes: this.checkMes,
    checkAnyo: this.checkAnyo,
    checkNumeroTarjeta: this.checkNumeroTarjeta,
    saldo: this.saldo,
  });

  formPassword = this.#fb.group(
    {
      password: this.password,
      password2: this.password2
    }, {validators: this.equalPass}
  );

  formNombre = this.#fb.group(
    {
      nombreActual: this.nombreActual,
      nuevoNombre: this.nuevoNombre
    }
  );

  formTarjeta = this.#fb.group(
    {
      numeroTarjeta: this.numeroTarjeta,
      cvv: this.cvv,
      mes: this.mes,
      anyo: this.anyo
    }
  );
  
  equalPass():ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
      const pass1 = control.get('password')?.value;
      const pass2 = control.get('password2')?.value;
      if (pass1.toLowerCase() != pass2.toLowerCase()) {
        return { email: true };
      }
      return null;      
    };
  }

  @ViewChild('confirmDialog') confirmDialog!: SwalComponent;
  @ViewChild('confirmDialog2') confirmDialog2!: SwalComponent;
  @ViewChild('confirmDialog3') confirmDialog3!: SwalComponent;



  ngOnInit(): void {
    const token = this.cookieService.get('token');
    if (this.id) {
      this.#profileService.getPerfil(this.id).subscribe({
        next: (user) => {
          this.usuario = user.resultado;
          this.#videojuegoService
            .getVideojuegosJugador(this.usuario._id)
            .subscribe({
              next: (videojuegos) => {
                this.videoJuegos = videojuegos;
              },
            });
        },
        error: (error) => {
          console.error('Error al obtener el perfil:', error);
        },
      });
    } else {
      this.#profileService.getMiPerfil().subscribe({
        next: (user) => {
          console.log(user);
          this.usuario = user.resultado;
          this.#profileService.getImagenPerfil(this.usuario._id).subscribe({
            next: (imagen) => {
              this.usuario.imagen = imagen.imagen;
            },
            error: (error) => {
              console.error('Error al obtener la imagen:', error);
            },
          })
        
          this.#profileService.getTarjetas(this.usuario._id).subscribe({
            next: (tarjetas) => {
              this.tarjetas = tarjetas.tarjetas;
            },
            error: (error) => {
              console.error('Error al obtener las tarjetas:', error);
            },
          })
          this.#videojuegoService
            .getVideojuegosJugador(this.usuario._id)
            .subscribe({
              next: (videojuegos) => {
                this.videoJuegos = videojuegos;
              },
            });
          this.#transaccionService
            .getTransacciones(this.usuario._id)
            .subscribe({
              next: (transacciones) => {
                this.transacciones = transacciones;
                console.log(this.transacciones);
              },
              error: (error) => {
                console.error('Error al obtener las transacciones:', error);
              },
            });
            this.#transaccionService.getTransaccionesFinalizadas(this.usuario._id).subscribe({
              next: (transacciones) => {
                this.transaccionesFinalizadas = transacciones;
              },
              error: (error) => {
                console.error('Error al obtener las transacciones:', error);
              },
            })
            
        },
        error: (error) => {
          console.error('Error al obtener mi perfil:', error);
        },
      });
    }
    this.obtenerUsuarios();

  }

  changeRating(rating: number) {
    const oldRating = this.usuario!.valoracion;
    this.usuario!.valoracion = rating;
    this.#profileService.changeRating(this.usuario._id, rating).subscribe({
      error: () => (this.usuario!.valoracion = oldRating),
    });
  }

  logout() {
    this.#authService.Logout();
    this.#router.navigate(['/login']);
  }

  
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  setActiveTab2(tab: string): void {
    this.activeTab2 = tab;
  }
  recargarSaldo(){

    if(this.tarjetaActiva === undefined){
      Swal.fire({
        icon: 'warning',
        title: 'Tarjeta no valida',
        text: 'Por favor, agrega una tarjeta',
        showConfirmButton: true
    }
    )
      return;
    }

    if(this.checkAnyo.value !== this.tarjetaActiva.anyo || this.checkMes.value !== this.tarjetaActiva.mes || this.checkCvv.value !== this.tarjetaActiva.cvv || "ES" + this.checkNumeroTarjeta.value !== this.tarjetaActiva.numero){

      Swal.fire({
        icon: 'warning',
        title: 'Tarjeta no valida',
        text: 'Por favor, revisa los datos de tu tarjeta',
        showConfirmButton: true
    }
    )
      return;
    }

    
    
    const saldo = this.form.value.saldo;
    this.#profileService.actualizarSaldo(this.usuario._id, this.saldo.value).subscribe({
      next: (saldo) => {
        
        Swal.fire({
          icon: 'success',
          title: 'Saldo actualizado',
        })
        this.form.reset();
        this.ngOnInit();
      },
      
      error: () => {
        this.ngOnInit();
      },
    })
  }
  
  changePass(){
    
    if(this.password.value === this.password2.value){
      const newPass: UserPasswordEdit = {
        ...this.formPassword.getRawValue()
      };

      this.#profileService.editPassword(this.usuario._id, newPass.password).subscribe({
        next:()=>{
          Swal.fire({
            icon: 'success',
            title: 'Contraseña actualizada',
            text: 'Redirigiendo a login...',
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true
          })
          this.logout();
          this.#router.navigate(['/login']);
        },
        error: (error) => console.error(error),
      })
    }
    else{
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Las contraseñas no coinciden',
      })
    }
    
  }

  obtenerUsuarios(){
    this.#profileService.getUsuarios().subscribe({
      next: (users) => {
        this.usuarios = users.usuarios;
      },
      error: (error) => {
        console.error('Error al obtener los usuarios:', error);
      },  
    });
  }

  checkForExistingUser(nombre: string | undefined): Usuario | null {
    const existingUser = this.usuarios.find(user => user.nombre.toLowerCase() === nombre?.toLowerCase());
    return existingUser || null;
}




changeNombre() {
  const nuevoNombre = this.nuevoNombre.value;
  try {
    const existingUser = this.checkForExistingUser(nuevoNombre);
    if (existingUser) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El nombre introducido ya existe. Por favor, elige otro nombre',
      });
      return;
    }

    if (this.nombreActual.value !== this.usuario?.nombre) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Debes introducir tu nombre actual para confirmar el cambio',
      });
      return;
    }

    this.#profileService.editNombre(this.usuario._id, nuevoNombre).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Nombre actualizado',
          text: 'Redirigiendo a perfil...',
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true
        }).then(() => {
         this.usuario.nombre = nuevoNombre;
        });
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Error al actualizar el nombre',
        });
        console.error(error);
      }
    });
  } catch (error) {
    console.error('Error checking for existing user:', error);
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Error al actualizar el nombre',
    });
  }
}


  confirmarVenta(id: string) {
    this.confirmDialog2.fire().then((result) => {
      if (result.isConfirmed) {
        this.#transaccionService.aceptarTransaccion(id).subscribe({
          next: () => {
            this.ngOnInit();
          },
          error: () => {
            this.ngOnInit();
          },
        });
      }
    });
  }

  confirmarRechazo(id: string) {
    
    this.confirmDialog.fire().then((result) => {
      if (result.isConfirmed) {
        this.#transaccionService.rechazarTransaccion(id).subscribe({
          next: () => {
            this.ngOnInit();
          },
          error: () => {
            this.ngOnInit();
          },
        });
      }
    });
  }

  finalizarTransaccion(id: string) {
    this.confirmDialog3.fire().then((result) => {
      if (result.isConfirmed) {
        this.#transaccionService.getArticuloTransaccion(id)
          .subscribe({
            next: (articulo) => {
              this.transaccionArticulo = articulo;
  
              this.#transaccionService.finalizarTransaccion(
                id,
                this.transaccionArticulo.idComprador._id,
                this.transaccionArticulo.idVendedor._id
              )
                .subscribe({
                  next: () => {
                    this.#videojuegoService.juegoVendido(this.transaccionArticulo.idArticulo._id)
                    .subscribe({
                      next: () => {
                        this.ngOnInit();
                      },
                      error: (error) => {
                        console.error('Error marking game as sold:', error);
                      },
                    });
                  },
                  error: (error) => {
                    console.error('Error finalizing transaction:', error);
                  },
                });           
            },
            error: (error) => {
              console.error('Error fetching transaction article:', error);
            },
          });
      }
    });
  }
  validClasses(ngModel: FormControl, validClass: string, errorClass: string) {
    return {
      [validClass]: ngModel.touched && ngModel.valid && ngModel.value,
      [errorClass]: ngModel.touched && ngModel.invalid,
    };
  }

  cambiarMes(event: Event) :void{
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.mes.setValue(String(selectedValue));
  }

  cambiarAnio(event: Event) :void{
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.anyo.setValue(String(selectedValue));
  }

  anadirTarjeta() {
    const nuevaTarjeta: Tarjeta = {
      idUsuario: this.usuario._id,
      numero: "ES" +this.formTarjeta.get('numeroTarjeta')?.value,
      cvv: this.formTarjeta.get('cvv')?.value,
      mes: this.formTarjeta.get('mes')?.value,
      anyo: this.formTarjeta.get('anyo')?.value
    }

    if(isNaN(Number(nuevaTarjeta.cvv))){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El CVV debe ser un número',
      });
      return;
    }
    else if(isNaN(Number(this.formTarjeta.get('numeroTarjeta')?.value))){
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'El número de la tarjeta debe ser un número',
      });
      return;
    }

    console.log(nuevaTarjeta);

    this.#profileService.anadirTarjeta(this.usuario._id, nuevaTarjeta).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Tarjeta anadida',
          text: 'Redirigiendo a perfil...',
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true
        })
        this.formTarjeta.reset();
        this.ngOnInit();
      },
      error: (error) => { 
        console.error(error);
      } 
    });
  }

  getLastFourDigits(numero: string | undefined): string {
    return numero!.slice(-4);
  }

  marcarComoActiva(tarjeta: any): void {
    this.tarjetaActiva = tarjeta;
  }
}
