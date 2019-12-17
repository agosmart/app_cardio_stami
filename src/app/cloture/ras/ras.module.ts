import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RasPageRoutingModule } from './ras-routing.module';

import { RasPage } from './ras.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RasPageRoutingModule
  ],
  declarations: [RasPage]
})
export class RasPageModule {}
