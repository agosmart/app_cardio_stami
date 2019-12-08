import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InscEcgPage } from './insc-ecg.page';

const routes: Routes = [
  {
    path: '',
    component: InscEcgPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InscEcgPageRoutingModule {}
