import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrientationRelativePage } from './orientation-relative.page';

const routes: Routes = [
  {
    path: '',
    component: OrientationRelativePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrientationRelativePageRoutingModule {}
