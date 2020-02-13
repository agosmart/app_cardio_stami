import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AvisMedPageRoutingModule } from './avis-med-routing.module';

import { AvisMedPage } from './avis-med.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AvisMedPageRoutingModule
  ],
  declarations: [AvisMedPage]
})
export class AvisMedPageModule {}
