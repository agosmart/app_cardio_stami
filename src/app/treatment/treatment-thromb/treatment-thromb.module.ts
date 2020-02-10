import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { TreatmentThrombPageRoutingModule } from "./treatment-thromb-routing.module";

import { TreatmentThrombPage } from "./treatment-thromb.page";
import { ImagePageModule } from "src/app/modal/image/image.module";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: "never" }),
    FormsModule,
    IonicModule,
    TreatmentThrombPageRoutingModule,
    ImagePageModule
  ],
  declarations: [TreatmentThrombPage]
})
export class TreatmentThrombPageModule {}
