import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ThrombRelativePageRoutingModule } from './thromb-relative-routing.module';

import { ThrombRelativePage } from './thromb-relative.page';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ThrombRelativePageRoutingModule
  ],
  declarations: [ThrombRelativePage]
})
export class ThrombRelativePageModule {}
