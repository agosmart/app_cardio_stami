import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnvoiCrPageRoutingModule } from './envoi-cr-routing.module';

import { EnvoiCrPage } from './envoi-cr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnvoiCrPageRoutingModule
  ],
  declarations: [EnvoiCrPage]
})
export class EnvoiCrPageModule {}
