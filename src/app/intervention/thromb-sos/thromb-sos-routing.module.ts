import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ThrombSosPage } from './thromb-sos.page';

const routes: Routes = [
  {
    path: '',
    component: ThrombSosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThrombSosPageRoutingModule {}
