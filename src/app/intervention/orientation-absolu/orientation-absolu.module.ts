import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { OrientationAbsoluPageRoutingModule } from "./orientation-absolu-routing.module";

import { OrientationAbsoluPage } from "./orientation-absolu.page";
import { AvisMedPageModule } from "src/app/modal/avis-med/avis-med.module";
import { ListCrPageModule } from "src/app/modal/list-cr/list-cr.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrientationAbsoluPageRoutingModule,
    AvisMedPageModule,
    ListCrPageModule
  ],
  declarations: [OrientationAbsoluPage]
})
export class OrientationAbsoluPageModule {}
