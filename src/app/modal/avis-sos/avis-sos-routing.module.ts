import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AvisSosPage } from './avis-sos.page';

const routes: Routes = [
  {
    path: '',
    component: AvisSosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AvisSosPageRoutingModule {}
