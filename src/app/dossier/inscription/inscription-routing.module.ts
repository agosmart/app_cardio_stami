import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InscriptionPage } from './inscription.page';

const routes: Routes = [
  {
    path: '',
    component: InscriptionPage
  }
  // {
  //   path: 'insc-infos',
  //   loadChildren: () => import('./insc-infos/insc-infos.module').then( m => m.InscInfosPageModule)
  // },

  // {
  //   path: 'insc-ecg',
  //   loadChildren: () => import('./insc-ecg/insc-ecg.module').then(m => m.InscEcgPageModule)
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InscriptionPageRoutingModule {}
