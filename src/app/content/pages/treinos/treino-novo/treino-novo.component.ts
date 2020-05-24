import { Component, OnInit, OnDestroy } from '@angular/core';
import { SemanaDias } from 'src/app/core/models/treinos/semana-dias';
import { TreinosService } from 'src/app/core/services/treinos/treinos.service';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/core/services/alert/alert.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { finalize } from 'rxjs/operators';
import { TreinoSemanaAdd } from 'src/app/core/models/treinos/treino-semana-add';

let _getSemanaDias$ = new Subscription();
let _postTreinoSemana$ = new Subscription();

@Component({
  selector: 'app-treino-novo',
  templateUrl: './treino-novo.component.html',
  styleUrls: ['./treino-novo.component.scss'],
})
export class TreinoNovoComponent implements OnInit, OnDestroy {
  semanaDias: SemanaDias[];
  idSemanaDia: number;
  constructor(private treinosService: TreinosService,
    private modalController: ModalController,
    private alertService: AlertService,
    private loadingService: LoadingService) { }

  ngOnInit() {
    this.getSemanaDias()
  }

  getSemanaDias() {
    _getSemanaDias$ = this.treinosService.getSemanaDias(true)
      .subscribe((result) => {
        if (result) {
          this.semanaDias = result.dados;
        }
      });
  }

  close() {
    this.modalController.dismiss();
  }

  novoTreino() {
    this.alertService.presentAlertConfirm('Novo treino', 'Confirma o início do treino na ' + this.semanaDias.filter((item) => item.idSemanaDia == this.idSemanaDia)[0].semanaDia + '?')
      .then((value) => {
        if (value == 'yes') {
          this.postTreinoSemana();
        }
      })
  }

  postTreinoSemana() {
    this.loadingService.presentLoading('Solicitando novo treino...');
    const _treinoSemanaAdd = new TreinoSemanaAdd();
    _treinoSemanaAdd.idSemanaDia = this.idSemanaDia;
    _postTreinoSemana$ = this.treinosService.postTreinoSemana(_treinoSemanaAdd).pipe(
      finalize(() => {
        this.loadingService.dismissLoading();

      })
    ).subscribe(() => {
      this.alertService.presentAlert('Treino liberado', 'Seu novo treino já está disponivel.')
        .then((value) => {
          this.modalController.dismiss(true);
        })
    }, (error) => {
      this.alertService.presentErrorAlertDefault('Atenção', error.error);
    })
  }

  btnSelected(idSemanaDia: number) {
    if (this.idSemanaDia == idSemanaDia) {
      return 'solid';
    }
    return 'outline';
  }

  ngOnDestroy() {
    _getSemanaDias$.unsubscribe();
    _postTreinoSemana$.unsubscribe();
  }

}
