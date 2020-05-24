import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { SemanaDias } from 'src/app/core/models/treinos/semana-dias';
import { TreinosService } from 'src/app/core/services/treinos/treinos.service';
import { Subscription } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { AlertService } from 'src/app/core/services/alert/alert.service';
import { LoadingService } from 'src/app/core/services/loading/loading.service';
import { finalize } from 'rxjs/operators';
import { TreinoSemanaAdd } from 'src/app/core/models/treinos/treino-semana-add';
import { ToastService } from 'src/app/core/services/toast/toast.service';

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
  formSaved: boolean = false;

  constructor(private treinosService: TreinosService,
    private modalController: ModalController,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService) { }

  ngOnInit() {
    this.getSemanaDias()
  }

  getSemanaDias(forceRefresh: boolean = false, event?: any) {
    _getSemanaDias$ = this.treinosService.getSemanaDias(forceRefresh).pipe(
      finalize(() => {
        if (event) {
          event.target.complete();
        }
        this.cdr.detectChanges();
      })
    )
      .subscribe((result) => {
        if (result) {
          this.semanaDias = result.dados;
        }
        if (!forceRefresh) {
          this.getSemanaDias(true)
        }
      },(err)=>{
        this.toastService.presentToast('Não foi possível atualizar :(');
      });
  }

  close() {
    if (this.formSaved == false && this.idSemanaDia) {
      this.alertService.presentAlertConfirm('Atenção', 'Você ainda não solicitou o treino. Tem certeza que deseja sair?')
        .then((value) => {
          if (value == 'yes') {
            this.modalController.dismiss();
          }
        })
      return;
    }
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
      this.formSaved = true;
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
