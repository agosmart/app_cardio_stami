import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { OrientationSosPageRoutingModule } from "./orientation-sos-routing.module";

import { OrientationSosPage } from "./orientation-sos.page";
import { AvisMedPageModule } from "src/app/modal/avis-med/avis-med.module";
import { ListCrPageModule } from "src/app/modal/list-cr/list-cr.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrientationSosPageRoutingModule,
    AvisMedPageModule,
    ListCrPageModule
  ],
  declarations: [OrientationSosPage]
})
export class OrientationSosPageModule {}
