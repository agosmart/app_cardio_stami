import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InscInfosPageRoutingModule } from './insc-infos-routing.module';

import { InscInfosPage } from './insc-infos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InscInfosPageRoutingModule
  ],
  declarations: [InscInfosPage]
})
export class InscInfosPageModule {}
