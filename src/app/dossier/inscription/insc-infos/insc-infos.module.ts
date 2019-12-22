import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InscInfosPageRoutingModule } from './insc-infos-routing.module';

import { InscInfosPage } from './insc-infos.page';
import { ImagePageModule } from 'src/app/modal/image/image.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    InscInfosPageRoutingModule,
    ImagePageModule,
  ],
  declarations: [InscInfosPage]
})
export class InscInfosPageModule {}
