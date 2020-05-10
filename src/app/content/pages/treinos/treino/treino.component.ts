import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-treino',
  templateUrl: './treino.component.html',
  styleUrls: ['./treino.component.scss'],
})
export class TreinoComponent implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {}

  close(){
    this.modalController.dismiss();
  }

  onSubmit(){
    this.modalController.dismiss(true);
  }

}
