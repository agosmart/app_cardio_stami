import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InterventionPage } from './intervention.page';

const routes: Routes = [
  {
    path: '',
    component: InterventionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InterventionPageRoutingModule {}
