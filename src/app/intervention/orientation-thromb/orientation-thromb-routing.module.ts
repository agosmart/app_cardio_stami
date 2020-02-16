import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrientationThrombPage } from './orientation-thromb.page';

const routes: Routes = [
  {
    path: '',
    component: OrientationThrombPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrientationThrombPageRoutingModule {}
