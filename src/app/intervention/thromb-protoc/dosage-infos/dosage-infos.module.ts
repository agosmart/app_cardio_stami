import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DosageInfosPageRoutingModule } from './dosage-infos-routing.module';

import { DosageInfosPage } from './dosage-infos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DosageInfosPageRoutingModule
  ],
  declarations: [DosageInfosPage]
})
export class DosageInfosPageModule {}
