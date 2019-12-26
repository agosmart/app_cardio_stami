import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GocrPage } from './gocr.page';

const routes: Routes = [
  {
    path: '',
    component: GocrPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GocrPageRoutingModule {}
