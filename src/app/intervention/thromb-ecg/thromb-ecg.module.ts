import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ThrombEcgPageRoutingModule } from './thromb-ecg-routing.module';

import { ThrombEcgPage } from './thromb-ecg.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ThrombEcgPageRoutingModule
  ],
  declarations: [ThrombEcgPage]
})
export class ThrombEcgPageModule {}
