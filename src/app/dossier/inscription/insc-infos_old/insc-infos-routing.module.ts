import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InscInfosPage } from './insc-infos.page';

const routes: Routes = [
  {
    path: '',
    component: InscInfosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InscInfosPageRoutingModule {}
