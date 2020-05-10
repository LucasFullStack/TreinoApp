import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TreinosPageRoutingModule } from './treinos-routing.module';

import { TreinosPage } from './treinos.page';
import { TreinoComponent } from './treino/treino.component';
import { TreinoNovoComponent } from './treino-novo/treino-novo.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TreinosPageRoutingModule
  ],
  declarations: [TreinosPage, TreinoComponent, TreinoNovoComponent],
  entryComponents: [TreinoComponent, TreinoNovoComponent]
})
export class TreinosPageModule {}
