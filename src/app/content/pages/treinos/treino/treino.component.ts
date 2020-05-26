import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { timer, Subscription } from 'rxjs';
import { Treinos } from 'src/app/core/models/treinos/treinos';
import { TreinosService } from 'src/app/core/services/treinos/treinos.service';
import { UtilService } from 'src/app/core/services/util/util.service';
import { TreinoSemanaEdit } from 'src/app/core/models/treinos/treino-semana-edit';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { AlertService } from 'src/app/core/services/alert/alert.service';
import { finalize } from 'rxjs/operators';

let _putTreinoSemana$ = new Subscription();

@Component({
  selector: 'app-treino',
  templateUrl: './treino.component.html',
  styleUrls: ['./treino.component.scss'],
})
export class TreinoComponent implements OnInit, OnDestroy {
  subscribeTimer: Subscription = new Subscription();
  startTreino: boolean = false;
  treino: Treinos = this.navParams.get('treino');
  tempoTreino: number = this.treino.tempoTreino;

  constructor(private modalController: ModalController,
    private navParams: NavParams,
    private treinosService: TreinosService,
    public utilService: UtilService,
    private loadingService: LoadingService,
    private alertService: AlertService) { }

  ngOnInit() {
    if (this.treino.treinando && !this.treino.dataExecucao) {
      this.iniciarTreino();
    }
  }

  ngOnDestroy() {
    _putTreinoSemana$.unsubscribe();
    this.stopTimer();
  }

  iniciarTreino() {
    this.startTreino = !this.startTreino;
    this.treino.treinando = true;
    this.startTimer();
  }

  pausarTreino(){
    this.startTreino = !this.startTreino;
    this.treino.treinando = false;
    this.stopTimer();
    this.tempoTreino = this.treino.tempoTreino;
    const _treinoSemana = this.prepareTreinoSemana();
    this.treinosService.putTreinoSemana(_treinoSemana).toPromise();
    this.treinosService.updateTreinoSemana(this.treino)
  }

  getName(): string{
    if(this.treino.tempoTreino > 0 && this.treino.treinando == false){
      return 'Continuar'
    }

    return 'Iniciar'
  }

  finalizarTreino() {
    this.startTreino = !this.startTreino;
    this.loadingService.presentLoading('Salvando...');
    this.treino.treinando = false;
    this.stopTimer();
    this.treino.executado = true;
    this.treino.dataExecucao = this.utilService.getDateTimeNow();
    const _treinoSemana = this.prepareTreinoSemana(true);
    this.putTreinoSemana(_treinoSemana);
  }

  putTreinoSemana(treinoSemanaEdit: TreinoSemanaEdit) {
    _putTreinoSemana$ = this.treinosService.putTreinoSemana(treinoSemanaEdit).pipe(
      finalize(() => {
        this.loadingService.dismissLoading();
      })
    ).subscribe(() => this.modalController.dismiss(true),
      (error) => this.alertService.presentErrorAlertDefault('Atenção!', error.error))
  }

  startTimer() {
    this.subscribeTimer = timer(1000, 2000).subscribe(val => {
      this.treino.tempoTreino = this.tempoTreino + val;
      const _treinoSemana = this.prepareTreinoSemana();
      this.treinosService.putTreinoSemana(_treinoSemana).toPromise();
      this.treinosService.updateTreinoSemana(this.treino)
    });
  }

  stopTimer() {
    this.subscribeTimer.unsubscribe();
  }

  prepareTreinoSemana(finalizar: boolean = false): TreinoSemanaEdit {
    const _treinoSemana = new TreinoSemanaEdit();
    _treinoSemana.idTreinoUsuario = this.treino.idTreinoUsuario;
    _treinoSemana.executado = this.treino.executado;
    _treinoSemana.dataExecucao = this.treino.dataExecucao;
    _treinoSemana.tempoTreino = this.treino.tempoTreino;
    _treinoSemana.finalizar = finalizar;
    _treinoSemana.treinando = this.treino.treinando;
    return _treinoSemana;
  }

  close() {
    if (this.startTreino) {
      this.alertService.presentAlertConfirm('Atenção!', 'O treino ainda não terminou. Deseja finaliza-lo?')
        .then((value) => {
          if (value == 'yes') {
            this.finalizarTreino();
          }
        })
      return;
    }
    this.modalController.dismiss();
  }

}
