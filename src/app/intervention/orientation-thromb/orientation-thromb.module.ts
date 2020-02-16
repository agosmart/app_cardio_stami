import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { OrientationThrombPageRoutingModule } from "./orientation-thromb-routing.module";

import { OrientationThrombPage } from "./orientation-thromb.page";
import { ImagePageModule } from "src/app/modal/image/image.module";
import { AvisMedPageModule } from "src/app/modal/avis-med/avis-med.module";
import { ListCrPageModule } from "src/app/modal/list-cr/list-cr.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrientationThrombPageRoutingModule,
    ImagePageModule,
    ListCrPageModule,
    AvisMedPageModule
  ],
  declarations: [OrientationThrombPage]
})
export class OrientationThrombPageModule {}
