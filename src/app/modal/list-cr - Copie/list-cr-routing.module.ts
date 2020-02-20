import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListCrPage } from './list-cr.page';

const routes: Routes = [
  {
    path: '',
    component: ListCrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListCrPageRoutingModule {}
