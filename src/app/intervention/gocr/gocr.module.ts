import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GocrPageRoutingModule } from './gocr-routing.module';

import { GocrPage } from './gocr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GocrPageRoutingModule
  ],
  declarations: [GocrPage]
})
export class GocrPageModule {}
