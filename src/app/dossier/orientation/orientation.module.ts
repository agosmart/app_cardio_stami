import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrientationPageRoutingModule } from './orientation-routing.module';

import { OrientationPage } from './orientation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrientationPageRoutingModule
  ],
  declarations: [OrientationPage]
})
export class OrientationPageModule {}
