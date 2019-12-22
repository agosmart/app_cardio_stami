import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PretreatmentPageRoutingModule } from './pretreatment-routing.module';

import { PretreatmentPage } from './pretreatment.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    PretreatmentPageRoutingModule
  ],
  declarations: [PretreatmentPage]
})
export class PretreatmentPageModule {}
