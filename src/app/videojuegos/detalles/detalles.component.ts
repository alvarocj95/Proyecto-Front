import { Component, Input, OnInit, computed, inject } from '@angular/core';
import { Videojuego } from '../interfaces/videojuego';
import { VideojuegoService } from '../services/videojuego.service';
import { RouterLink } from '@angular/router';
import { ProfileService } from '../../profile/services/profile.service';
import { Usuario } from '../../auth/interfaces/usuarios';
import { TransaccionService } from '../../transacciones/transaccion.service';
import { Transaccion } from '../../transacciones/interfaces/transaccion';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { AuthService } from '../../auth/services/auth.service';
import { LikesService } from '../../likes/likes.service';


@Component({
  selector: 'app-detalles',
  standalone: true,
  imports: [RouterLink, SweetAlert2Module],
  templateUrl: './detalles.component.html',
  styleUrl: './detalles.component.css'
})
export class DetallesComponent implements OnInit{
  @Input() id?: string;
  videojuego!: Videojuego;
  #videoJuegoService = inject(VideojuegoService);
  #profileService = inject(ProfileService);
  #likesService = inject(LikesService);
  usuario!: Usuario;
  usuarioLogueado!: Usuario;
  #transaccionService = inject(TransaccionService);
  transacciones!: Transaccion[];
  #authService = inject(AuthService);
  logged = computed(() => this.#authService.logged());
  pendiente: boolean = false;
  likes: number = 0;
  totalTransacciones: number = 0;
  

  ngOnInit(): void {
    if(this.id) {
      this.#videoJuegoService
      .getVideoJuego(this.id!)
      .subscribe({
        next: (videojuego) => {
          this.videojuego = videojuego;
          this.#profileService.getPerfil(this.videojuego.idUsuario).subscribe({
            next: (user) => {
              this.usuario = user.resultado;
            }
          })
          this.#profileService.getMiPerfil().subscribe({
            next: (user) => {
              this.usuarioLogueado = user.resultado;
            }
          })
        },
        error: (error) => {
          console.error("Error al obtener el videojuego:", error);
        }
      });

      this.#likesService.getTotalLikes(this.id).subscribe({
        next: (likes) => {
          this.likes = likes;
        },
        error: (error) => {
          console.error("Error al obtener los likes:", error);
        }
      });

      this.#transaccionService.getTotalTransacciones(this.id).subscribe({
        next: (transacciones) => {
          this.totalTransacciones = transacciones;
        },
        error: (error) => {
          console.error("Error al obtener las transacciones:", error);
        }
      })
    }
  }
  mostrar(){
    console.log("Funciona", this.id);
  }

  addCarrito(){
    this.#transaccionService
      .getTransacciones(this.usuarioLogueado._id)
      .subscribe({
        next: (transacciones) => {
          this.transacciones = transacciones;
          this.transacciones.forEach((transaccion) => {
            if(transaccion.idArticulo?._id == this.videojuego._id && transaccion.idComprador._id == this.usuarioLogueado._id ){
              this.pendiente = true;
              Swal.fire({
                icon: 'warning',
                title: 'Ya tienes una transacción pendiente para este videojuego',
              });
            }
          })
          if(this.pendiente == false){
            Swal.fire({
              title: '¿Cuánto dinero quieres ofrecer?',
              input: 'number',
              showCancelButton: true,
              cancelButtonText: 'Cancelar',
              confirmButtonText: 'Ofertar',
              preConfirm: (value) => {
                if (!value) {
                  return Swal.showValidationMessage('Debes introducir un importe');
                }
                if (value <= 0) {
                  return Swal.showValidationMessage('El importe debe ser mayor que 0');
                }
                if (value > this.usuarioLogueado.saldo) {
                  return Swal.showValidationMessage('No tienes suficiente saldo en el monedero, solo tienes ' + this.usuarioLogueado.saldo + '€');
                  
                }
                return value;
              },
            }).then((result) => {
              if (result.isConfirmed) {
                this.#transaccionService.nuevaTransaccion(this.videojuego._id, this.usuarioLogueado._id, this.usuario._id, result.value).subscribe({
                  next: () => {
                    Swal.fire({
                      icon: 'success',
                      title: 'Petición realizada correctamente',
                      text: 'El vendedor se pondrá en contacto contigo',
                    });
                  },
                  error: (error) => {
                    console.error("Error al realizar la transacción:", error);
                  }
                })
              }
            })

          }
        },
        error: (error) => {
          console.error("Error al obtener las transacciones:", error);
        }
      });
  }

  
}
