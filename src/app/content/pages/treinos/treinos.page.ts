import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TreinoComponent } from './treino/treino.component';


@Component({
  selector: 'app-treinos',
  templateUrl: './treinos.page.html',
  styleUrls: ['./treinos.page.scss'],
})
export class TreinosPage implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  async openTreino(){
    const modal = await this.modalController.create({
      component: TreinoComponent
    });
    return await modal.present();
  }

}
