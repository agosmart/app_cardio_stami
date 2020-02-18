import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { OrientationRelativePageRoutingModule } from "./orientation-relative-routing.module";

import { OrientationRelativePage } from "./orientation-relative.page";
import { AvisMedPageModule } from "src/app/modal/avis-med/avis-med.module";
import { ListCrPageModule } from "src/app/modal/list-cr/list-cr.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrientationRelativePageRoutingModule,
    ListCrPageModule,
    AvisMedPageModule
  ],
  declarations: [OrientationRelativePage]
})
export class OrientationRelativePageModule {}
