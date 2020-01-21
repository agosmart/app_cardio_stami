import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ThrombSosPageRoutingModule } from './thromb-sos-routing.module';

import { ThrombSosPage } from './thromb-sos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ThrombSosPageRoutingModule
  ],
  declarations: [ThrombSosPage]
})
export class ThrombSosPageModule {}