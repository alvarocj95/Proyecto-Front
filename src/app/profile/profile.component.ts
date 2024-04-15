import {
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
import { Usuario } from '../auth/interfaces/usuarios';
import { UsuarioResponse } from '../auth/interfaces/responses';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { VideojuegoService } from '../videojuegos/services/videojuego.service';
import { Videojuego } from '../videojuegos/interfaces/videojuego';
import { CardComponent } from '../videojuegos/card/card.component';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { Transaccion } from '../transacciones/interfaces/transaccion';
import { TransaccionService } from '../transacciones/transaccion.service';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

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
    FormsModule
    
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
  #fb = inject(NonNullableFormBuilder);

  
  

  @ViewChild('confirmDialog') confirmDialog!: SwalComponent;
  @ViewChild('confirmDialog2') confirmDialog2!: SwalComponent;

  saldo = this.#fb.control(1, [Validators.required, Validators.min(1)]);

  form = this.#fb.group({
    saldo: this.saldo,
  });


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

  activeTab: string = 'compras'; // Tab por defecto

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  recargarSaldo(){
    const saldo = this.form.value.saldo;
    this.#profileService.actualizarSaldo(this.usuario._id, this.saldo.value).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Saldo actualizado',
        })
        this.usuario.saldo += this.saldo.value;
      },
      error: () => {
        this.ngOnInit();
      },
    })
  }

  // aceptarTransaccion(id: string) {
  //   this.#transaccionService.aceptarTransaccion(id).subscribe({
  //     next: () => {
  //       this.ngOnInit();
  //     },
  //     error: () => {
  //       this.ngOnInit();
  //     },});
    
  // }
  // rechazarTransaccion(id: string) {
  //   this.#transaccionService.rechazarTransaccion(id).subscribe({
  //     next: () => {
  //       this.ngOnInit();
  //     },
  //     error: () => {
  //       this.ngOnInit();
  //     },
  //   })
  // }

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

 

}
