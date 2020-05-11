import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TreinoComponent } from './treino/treino.component';
import { TreinoNovoComponent } from './treino-novo/treino-novo.component';
import { TreinosSemana } from 'src/app/core/models/treinos/treinos-semana';
import { Subscription } from 'rxjs';
import { TreinosService } from 'src/app/core/services/treinos/treinos.service';
import { Treinos } from 'src/app/core/models/treinos/treinos';

let _getTreinosSemana$ = new Subscription();

@Component({
  selector: 'app-treinos',
  templateUrl: './treinos.page.html',
  styleUrls: ['./treinos.page.scss'],
})
export class TreinosPage implements OnInit, OnDestroy {
  treinosSemana: TreinosSemana = new TreinosSemana();

  constructor(private modalController: ModalController, 
              private treinosService: TreinosService) { }

  ngOnInit() {
    this.getTreinosSemana();
  }

  ngOnDestroy(){
    _getTreinosSemana$.unsubscribe();
  }

  getTreinosSemana(){
    _getTreinosSemana$ = this.treinosService.getTreinosSemana(true)
                                            .subscribe((result)=>{
                                              console.log(result)
                                              if(result){
                                                this.treinosSemana = result.dados[0];
                                              }
                                            })
  }

  async openNovoTreino(){
    const modal = await this.modalController.create({
      component: TreinoNovoComponent
    });
    return await modal.present();
  }


  async openTreino(treino: Treinos){
    const modal = await this.modalController.create({
      component: TreinoComponent,
      componentProps: { treino }
    });
    return await modal.present();
  }

}
