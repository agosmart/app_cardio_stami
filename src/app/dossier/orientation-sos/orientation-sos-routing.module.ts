import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrientationSosPage } from './orientation-sos.page';

const routes: Routes = [
  {
    path: '',
    component: OrientationSosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrientationSosPageRoutingModule {}
