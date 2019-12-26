import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ThrombPage } from './thromb.page';

const routes: Routes = [
  {
    path: '',
    component: ThrombPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThrombPageRoutingModule {}
