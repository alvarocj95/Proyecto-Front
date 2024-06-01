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
import { UsuarioResponse } from '../auth/interfaces/responses';
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
 
  #profileService = inject(ProfileService);
  #videojuegoService = inject(VideojuegoService);
  usuario!: Usuario;
  @Input() id!: string;
  cookieService = inject(SsrCookieService);
  videoJuegos: Videojuego[] = [];
  logged = computed(() => this.#authService.logged());
  #authService = inject(AuthService);
  #router = inject(Router);
  #transaccionService = inject(TransaccionService);
  transacciones!: Transaccion[];
  transaccionesFinalizadas!: Transaccion[];
  transaccionArticulo!: Transaccion;
  #fb = inject(NonNullableFormBuilder);
  password = this.#fb.control('',[Validators.required, Validators.minLength(4)]);  
  password2 = this.#fb.control('',[Validators.required, Validators.minLength(4)]);
  saldo = this.#fb.control(1, [Validators.required, Validators.min(1)]);
  activeTab: string = 'compras'; 
  activeTab2: string = 'saldo';
  
  form = this.#fb.group({
    saldo: this.saldo,
  });

  formPassword = this.#fb.group(
    {
      password: this.password,
      password2: this.password2
    }, {validators: this.equalPass}
  );


  
  equalPass():ValidatorFn{
    return (control: AbstractControl): ValidationErrors | null => {
      const pass1 = control.get('password')?.value;
      const pass2 = control.get('password2')?.value;
      if (pass1 != pass2) {
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
  // recargarSaldo(){
  //   const saldo = this.form.value.saldo;
  //   this.#profileService.actualizarSaldo(this.usuario._id, this.saldo.value).subscribe({
  //     next: () => {
  //       Swal.fire({
  //         icon: 'success',
  //         title: 'Saldo actualizado',
  //       })
  //       this.#profileService.getMiPerfil().subscribe({
  //         next: (user) => {
  //           this.usuario = user.resultado;
  //         },
  //         error: (error) => {
  //           console.error('Error al obtener el perfil:', error);
  //         },
  //       })
  //     },
      
  //     error: () => {
  //       this.ngOnInit();
  //     },
  //   })
  // }
  constructor(private cd: ChangeDetectorRef) {
  }

  recargarSaldo() {
    const saldo = this.form.value.saldo;
    this.#profileService.actualizarSaldo(this.usuario._id, this.saldo.value).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Saldo actualizado',
        });
        
        this.usuario.saldo += this.saldo.value;
        this.cd.detectChanges(); 

        
        this.#profileService.getMiPerfil().subscribe({
          next: (user) => {
            this.usuario = user.resultado;
            this.cd.detectChanges(); 
          },
          error: (error) => {
            console.error('Error al obtener el perfil:', error);
          },
        });
      },
      error: () => {
        this.ngOnInit();
      },
    });
  }
  
  changePass(){
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
        this.#router.navigate(['/login']);
      },
      error: (error) => console.error(error),
    })
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

  selectedFilter: string = 'none'; 

  // onFilterChange() {
  //   if (this.selectedFilter === 'none') {
  //     return;
  //   }

  //   const filteredGames = this.transacciones.slice();

  //   switch (this.selectedFilter) {
  //     case 'Aceptada':
  //       filteredGames.sort((a, b) => b.f - a.lanzamiento);
  //       break;
  //     case '-date':
  //       filteredGames.sort((a, b) => a.lanzamiento - b.lanzamiento);
  //       break;
  //     case 'price':
  //       filteredGames.sort((a, b) => a.precio - b.precio);
  //       break;
  //     case '-price':
  //       filteredGames.sort((a, b) => b.precio - a.precio);
  //       break;
  //   }
  // }
}
