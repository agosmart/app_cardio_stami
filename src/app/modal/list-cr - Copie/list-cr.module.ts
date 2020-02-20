import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListCrPageRoutingModule } from './list-cr-routing.module';

import { ListCrPage } from './list-cr.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListCrPageRoutingModule
  ],
  declarations: [ListCrPage]
})
export class ListCrPageModule {}
