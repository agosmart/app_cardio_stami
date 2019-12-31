import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ThrombEcgPage } from './thromb-ecg.page';

const routes: Routes = [
  {
    path: '',
    component: ThrombEcgPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThrombEcgPageRoutingModule {}
