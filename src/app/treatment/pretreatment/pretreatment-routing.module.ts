import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PretreatmentPage } from './pretreatment.page';

const routes: Routes = [
  {
    path: '',
    component: PretreatmentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PretreatmentPageRoutingModule {}
