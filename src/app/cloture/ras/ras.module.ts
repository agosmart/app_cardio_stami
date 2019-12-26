import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { RasPageRoutingModule } from "./ras-routing.module";

import { RasPage } from "./ras.page";
import { ImagePageModule } from "src/app/modal/image/image.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RasPageRoutingModule,
    ImagePageModule
  ],
  declarations: [RasPage]
})
export class RasPageModule {}
