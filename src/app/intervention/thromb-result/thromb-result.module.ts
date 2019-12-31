import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ThrombResultPageRoutingModule } from './thromb-result-routing.module';

import { ThrombResultPage } from './thromb-result.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ThrombResultPageRoutingModule
  ],
  declarations: [ThrombResultPage]
})
export class ThrombResultPageModule {}
