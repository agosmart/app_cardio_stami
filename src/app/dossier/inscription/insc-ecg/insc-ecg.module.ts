import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { InscEcgPageRoutingModule } from "./insc-ecg-routing.module";

import { InscEcgPage } from "./insc-ecg.page";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    InscEcgPageRoutingModule
  ],
  declarations: [InscEcgPage]
})
export class InscEcgPageModule {}
