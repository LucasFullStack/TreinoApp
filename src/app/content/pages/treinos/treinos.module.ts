import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TreinosPageRoutingModule } from './treinos-routing.module';

import { TreinosPage } from './treinos.page';
import { TreinoComponent } from './treino/treino.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TreinosPageRoutingModule
  ],
  declarations: [TreinosPage, TreinoComponent],
  entryComponents: [TreinoComponent]
})
export class TreinosPageModule {}
