import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RasPage } from './ras.page';

const routes: Routes = [
  {
    path: '',
    component: RasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RasPageRoutingModule {}
