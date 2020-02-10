import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";
import { ReactiveFormsModule } from "@angular/forms";
import { TreatmentEngioPageRoutingModule } from "./treatment-engio-routing.module";

import { TreatmentEngioPage } from "./treatment-engio.page";
import { ImagePageModule } from "src/app/modal/image/image.module";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: "never" }),
    FormsModule,
    IonicModule,
    TreatmentEngioPageRoutingModule,
    ImagePageModule
  ],
  declarations: [TreatmentEngioPage]
})
export class TreatmentEngioPageModule {}
