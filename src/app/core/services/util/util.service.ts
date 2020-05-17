import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() { }

  getDateTimeNow() {
    let date = new Date();
    let data2 = new Date(date.valueOf() - date.getTimezoneOffset() * 60000);
    return data2.toISOString().replace(/\.\d{3}Z$/, '');
  }

  
  transforma_seguntosEmHoras(s) {
    function duas_casas(numero) {
      if (numero <= 9) {
        numero = "0" + numero;
      }
      return numero;
    }
    var hora = duas_casas(Math.round(s / 3600));
    var minuto = duas_casas(Math.round((s % 3600) / 60));
    var segundo = duas_casas((s % 3600) % 60);
    var formatado = hora + ":" + minuto + ":" + segundo;
    return formatado;
  }

}
