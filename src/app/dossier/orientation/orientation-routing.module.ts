import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrientationPage } from './orientation.page';

const routes: Routes = [
  {
    path: '',
    component: OrientationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrientationPageRoutingModule {}
