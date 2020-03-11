import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AvisSosPageRoutingModule } from './avis-sos-routing.module';

import { AvisSosPage } from './avis-sos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AvisSosPageRoutingModule
  ],
  declarations: [AvisSosPage]
})
export class AvisSosPageModule {}
