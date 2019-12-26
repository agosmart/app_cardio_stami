import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LastDrugPageRoutingModule } from './last-drug-routing.module';

import { LastDrugPage } from './last-drug.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LastDrugPageRoutingModule
  ],
  declarations: [LastDrugPage]
})
export class LastDrugPageModule {}
