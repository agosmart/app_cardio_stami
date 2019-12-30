import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ThrombAbsolutPageRoutingModule } from "./thromb-absolut-routing.module";

import { ThrombAbsolutPage } from "./thromb-absolut.page";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ThrombAbsolutPageRoutingModule
  ],
  declarations: [ThrombAbsolutPage]
})
export class ThrombAbsolutPageModule {}
