import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ThrombProtocPage } from './thromb-protoc.page';

const routes: Routes = [
  {
    path: '',
    component: ThrombProtocPage
  },  {
    path: 'dosage-infos',
    loadChildren: () => import('./dosage-infos/dosage-infos.module').then( m => m.DosageInfosPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThrombProtocPageRoutingModule {}
