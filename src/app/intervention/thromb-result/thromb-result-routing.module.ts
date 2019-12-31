import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ThrombResultPage } from './thromb-result.page';

const routes: Routes = [
  {
    path: '',
    component: ThrombResultPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThrombResultPageRoutingModule {}
