import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { timer, Subscription, Subject } from 'rxjs';

@Component({
  selector: 'app-treino',
  templateUrl: './treino.component.html',
  styleUrls: ['./treino.component.scss'],
})
export class TreinoComponent implements OnInit {
  subscribeTimer: Subscription = new Subscription();
  timer: number;
  startTreino: boolean = false;
  cronometro: string;

  constructor(private modalController: ModalController) { }

  ngOnInit() {

  }

  iniciarTreino(){
    this.startTreino = !this.startTreino;
    this.startTimer();
  }

  finalizarTreino(){
    this.startTreino = !this.startTreino;
  }

  startTimer() {
    this.subscribeTimer = timer(1000, 2000).subscribe(val => {
      this.timer = val;
      this.cronometro = this.transforma_magicamente(this.timer);
    });
  }

  transforma_magicamente(s) {
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

  stopTimer() {
    this.subscribeTimer.unsubscribe();
  }

  close() {
    this.modalController.dismiss();
  }


}
