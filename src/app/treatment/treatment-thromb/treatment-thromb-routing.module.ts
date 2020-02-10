import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TreatmentThrombPage } from './treatment-thromb.page';

const routes: Routes = [
  {
    path: '',
    component: TreatmentThrombPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TreatmentThrombPageRoutingModule {}
