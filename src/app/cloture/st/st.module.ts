import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { StPageRoutingModule } from "./st-routing.module";

import { StPage } from "./st.page";
import { ImagePageModule } from "src/app/modal/image/image.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StPageRoutingModule,
    ImagePageModule
  ],
  declarations: [StPage]
})
export class StPageModule {}
