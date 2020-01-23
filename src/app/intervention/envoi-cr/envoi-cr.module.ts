import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { EnvoiCrPageRoutingModule } from "./envoi-cr-routing.module";

import { EnvoiCrPage } from "./envoi-cr.page";
import { ImagePageModule } from "src/app/modal/image/image.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnvoiCrPageRoutingModule,
    ImagePageModule
  ],
  declarations: [EnvoiCrPage]
})
export class EnvoiCrPageModule {}
