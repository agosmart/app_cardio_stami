import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LastDrugPage } from './last-drug.page';

const routes: Routes = [
  {
    path: '',
    component: LastDrugPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LastDrugPageRoutingModule {}
