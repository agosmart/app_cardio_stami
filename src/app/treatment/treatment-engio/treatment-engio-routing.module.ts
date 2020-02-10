import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TreatmentEngioPage } from './treatment-engio.page';

const routes: Routes = [
  {
    path: '',
    component: TreatmentEngioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TreatmentEngioPageRoutingModule {}
