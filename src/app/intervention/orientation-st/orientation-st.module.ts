import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { OrientationStPageRoutingModule } from "./orientation-st-routing.module";
import { ImagePageModule } from "src/app/modal/image/image.module";
import { AvisMedPageModule } from "src/app/modal/avis-med/avis-med.module";
import { ListCrPageModule } from "src/app/modal/list-cr/list-cr.module";
import { OrientationStPage } from "./orientation-st.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrientationStPageRoutingModule,
    ImagePageModule,
    ListCrPageModule,
    AvisMedPageModule
  ],
  declarations: [OrientationStPage]
})
export class OrientationStPageModule {}
