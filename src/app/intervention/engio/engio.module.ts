import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EngioPageRoutingModule } from './engio-routing.module';

import { EngioPage } from './engio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EngioPageRoutingModule
  ],
  declarations: [EngioPage]
})
export class EngioPageModule {}
