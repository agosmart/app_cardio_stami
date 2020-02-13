import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StPage } from './st.page';

const routes: Routes = [
  {
    path: '',
    component: StPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StPageRoutingModule {}
