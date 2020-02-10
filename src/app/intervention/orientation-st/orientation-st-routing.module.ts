import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrientationStPage } from './orientation-st.page';

const routes: Routes = [
  {
    path: '',
    component: OrientationStPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrientationStPageRoutingModule {}
