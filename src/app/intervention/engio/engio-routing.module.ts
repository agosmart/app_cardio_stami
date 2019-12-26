import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EngioPage } from './engio.page';

const routes: Routes = [
  {
    path: '',
    component: EngioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EngioPageRoutingModule {}
