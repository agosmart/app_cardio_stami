import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { OrientationStPageRoutingModule } from "./orientation-st-routing.module";
import { ImagePageModule } from "src/app/modal/image/image.module";
import { OrientationStPage } from "./orientation-st.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrientationStPageRoutingModule,
    ImagePageModule
  ],
  declarations: [OrientationStPage]
})
export class OrientationStPageModule {}
