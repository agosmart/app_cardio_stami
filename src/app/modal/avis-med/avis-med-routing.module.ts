import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AvisMedPage } from './avis-med.page';

const routes: Routes = [
  {
    path: '',
    component: AvisMedPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AvisMedPageRoutingModule {}
