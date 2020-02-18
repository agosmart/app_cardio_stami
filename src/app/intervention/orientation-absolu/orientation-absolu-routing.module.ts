import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrientationAbsoluPage } from './orientation-absolu.page';

const routes: Routes = [
  {
    path: '',
    component: OrientationAbsoluPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrientationAbsoluPageRoutingModule {}
