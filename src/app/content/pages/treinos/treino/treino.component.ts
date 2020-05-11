import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { timer, Subscription, Subject } from 'rxjs';
import { Treinos } from 'src/app/core/models/treinos/treinos';

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
  treino: Treinos = this.navParams.get('treino');

  constructor(private modalController: ModalController,
              private navParams: NavParams) { }

  ngOnInit() {
    console.log(this.treino)

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
