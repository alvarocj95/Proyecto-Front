import { Pipe, PipeTransform } from '@angular/core';
import { Transaccion } from '../../transacciones/interfaces/transaccion';

@Pipe({
  name: 'filtroTransacciones',
  standalone: true

})
export class FiltroTransacciones implements PipeTransform {

    transform(transacciones: Transaccion[], filter: string): Transaccion[] {
        if (filter === 'none') {
          return transacciones;
        }
    
        let transaccionesFiltradas = transacciones.slice();
    
        switch (filter) {
          case 'Aceptada':
          case 'Pendiente':
          case 'Rechazada':
            transaccionesFiltradas = transaccionesFiltradas.filter(transaccion => transaccion.estado === filter);
            break;
          default:
            break;
        }
    
        return transaccionesFiltradas;
      }
      
}