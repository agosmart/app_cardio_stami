import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { ThrombProtocPageRoutingModule } from "./thromb-protoc-routing.module";

import { ThrombProtocPage } from "./thromb-protoc.page";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    ThrombProtocPageRoutingModule
  ],
  declarations: [ThrombProtocPage]
})
export class ThrombProtocPageModule {}
