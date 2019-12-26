import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ThrombPageRoutingModule } from './thromb-routing.module';

import { ThrombPage } from './thromb.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ThrombPageRoutingModule
  ],
  declarations: [ThrombPage]
})
export class ThrombPageModule { }
