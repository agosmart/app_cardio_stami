import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ThrombRelativePage } from './thromb-relative.page';

const routes: Routes = [
  {
    path: '',
    component: ThrombRelativePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThrombRelativePageRoutingModule {}
