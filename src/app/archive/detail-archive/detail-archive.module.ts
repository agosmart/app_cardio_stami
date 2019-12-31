import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailArchivePageRoutingModule } from './detail-archive-routing.module';

import { DetailArchivePage } from './detail-archive.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailArchivePageRoutingModule
  ],
  declarations: [DetailArchivePage]
})
export class DetailArchivePageModule {}
