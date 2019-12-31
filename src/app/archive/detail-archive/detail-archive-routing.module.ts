import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailArchivePage } from './detail-archive.page';

const routes: Routes = [
  {
    path: '',
    component: DetailArchivePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailArchivePageRoutingModule {}
