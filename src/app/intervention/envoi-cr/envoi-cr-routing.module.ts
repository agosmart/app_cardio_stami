import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnvoiCrPage } from './envoi-cr.page';

const routes: Routes = [
  {
    path: '',
    component: EnvoiCrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnvoiCrPageRoutingModule {}
