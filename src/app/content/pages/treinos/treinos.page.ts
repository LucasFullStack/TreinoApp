import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TreinoComponent } from './treino/treino.component';
import { TreinoNovoComponent } from './treino-novo/treino-novo.component';
import { TreinosSemana } from 'src/app/core/models/treinos/treinos-semana';
import { Subscription } from 'rxjs';
import { TreinosService } from 'src/app/core/services/treinos/treinos.service';
import { Treinos } from 'src/app/core/models/treinos/treinos';
import { finalize } from 'rxjs/operators';

let _getTreinosSemana$ = new Subscription();

@Component({
  selector: 'app-treinos',
  templateUrl: './treinos.page.html',
  styleUrls: ['./treinos.page.scss'],
})
export class TreinosPage implements OnInit, OnDestroy {
  treinosSemana: TreinosSemana = new TreinosSemana();
  date: Date = new Date();

  constructor(private modalController: ModalController,
              private treinosService: TreinosService,
              private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.getTreinosSemana();
    console.log(this.date.toISOString())
  }

  ngOnDestroy() {
    _getTreinosSemana$.unsubscribe();
  }


  getTreinosSemana(forceRefresh: boolean = false, event?: any) {
    _getTreinosSemana$ = this.treinosService.getTreinosSemana(forceRefresh).pipe(
      finalize(() => {
        if (event) {
          event.target.complete();
        }
        this.cdr.detectChanges();
      })
    )
      .subscribe((result) => {
        if (result) {
          this.treinosSemana = result.dados[0];
          this.treinosSemana.dataFim
        }
      })
  }

  async openNovoTreino() {
    const modal = await this.modalController.create({
      component: TreinoNovoComponent
    });
    return await modal.present();
  }


  async openTreino(treino: Treinos) {
    const modal = await this.modalController.create({
      component: TreinoComponent,
      componentProps: { treino }
    });
    return await modal.present();
  }

}
