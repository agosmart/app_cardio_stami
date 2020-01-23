import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { OrientationPageRoutingModule } from "./orientation-routing.module";

import { OrientationPage } from "./orientation.page";
import { ImagePageModule } from "src/app/modal/image/image.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrientationPageRoutingModule,
    ImagePageModule
  ],
  declarations: [OrientationPage]
})
export class OrientationPageModule {}
