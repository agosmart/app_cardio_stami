import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ThrombAbsolutPage } from './thromb-absolut.page';

const routes: Routes = [
  {
    path: '',
    component: ThrombAbsolutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThrombAbsolutPageRoutingModule {}
