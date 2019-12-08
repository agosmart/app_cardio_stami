import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
/*
const routes: Routes = [
  // { path: '', redirectTo: 'onboard', pathMatch: 'full' },
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },

  {
    path: 'onboard',
    loadChildren: () =>
      import('./onboard/onboard.module').then(m => m.OnboardPageModule)
  },

  // # LOGIN USER
  {
    path: 'login',
    loadChildren: () =>
      import('./authentication/login/login.module').then(m => m.LoginPageModule)
  },
  // # REGISTER USER
  {
    path: 'register',
    loadChildren: () =>
      import('./authentication/register/register.module').then(
        m => m.RegisterPageModule
      )
  },
  // # RESET PASSWORD
  {
    path: 'reset',
    loadChildren: () =>
      import('./authentication/reset/reset.module').then(m => m.ResetPageModule)
  },

  // # 1 - INSCRIPTION INITIALE
  {
    path: 'inscription',
    loadChildren: () =>
      import('./dossier/inscription/inscription.module').then(
        m => m.InscriptionPageModule
      )
  },
  // # 2 - INSCRIPTION ECG
  {
    path: '',
    children: [
      {
        path: 'insc-ecg/:objetInsc',
        loadChildren: () =>
          import('./dossier/inscription/insc-ecg/insc-ecg.module').then(
            m => m.InscEcgPageModule
          )
      },
      {
        path: 'insc-infos/:idDossier',
        loadChildren: () =>
          import('./dossier/inscription/insc-infos/insc-infos.module').then(
            m => m.InscInfosPageModule
          )
      }
    ]
  },
  // # 3 - DIAGNOSTIC
  {
    path: 'diagnostic',
    loadChildren: () =>
      import('./dossier/diagnostic/diagnostic.module').then(
        m => m.DiagnosticPageModule
      )
  },
  // # 4 - ORIENTATION
  {
    path: 'orientation',
    loadChildren: () =>
      import('./dossier/orientation/orientation.module').then(
        m => m.OrientationPageModule
      )
  }
];


*/


const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },

  /**********************************************
                  - INTRO APP
  ************************************************/
  {
    path: 'onboard',
    loadChildren: () =>
      import('./onboard/onboard.module').then(m => m.OnboardPageModule)
  },

  /**********************************************
              - AUTHENTICATION USER
  ************************************************/
  // # LOGIN USER
  {
    path: 'login',
    loadChildren: () =>
      import('./authentication/login/login.module').then(m => m.LoginPageModule)
  },
  // # REGISTER USER
  {
    path: 'register',
    loadChildren: () =>
      import('./authentication/register/register.module').then(
        m => m.RegisterPageModule
      )
  },
  // # RESET PASSWORD
  {
    path: 'reset',
    loadChildren: () =>
      import('./authentication/reset/reset.module').then(m => m.ResetPageModule)
  },

  /**********************************************
          - CREATION DU DOSSIER PATIENT
  ************************************************/
  // # 1 - INSCRIPTION INITIALE
  {
    path: 'inscription',
    loadChildren: () =>
      import('./dossier/inscription/inscription.module').then(
        m => m.InscriptionPageModule
      )
  },
  // # 2 - INSCRIPTION ECG
  {
    path: '',
    children: [
      {
        path: 'insc-ecg',
        loadChildren: () =>
          import('./dossier/inscription/insc-ecg/insc-ecg.module').then(
            m => m.InscEcgPageModule
          )
      },
      {
        // path: 'insc-infos/:objetInsc',
        path: 'insc-infos/:idDossier',
        loadChildren: () =>
          import('./dossier/inscription/insc-infos/insc-infos.module').then(
            m => m.InscInfosPageModule
          )
      }
    ]
  },
  // # 3 - DIAGNOSTIC
  {
    path: 'diagnostic/:dataPatientObj',
    loadChildren: () =>
      import('./dossier/diagnostic/diagnostic.module').then(
        m => m.DiagnosticPageModule
      )
  },
  // # 4 - ORIENTATION
  {
    path: 'orientation',
    loadChildren: () =>
      import('./dossier/orientation/orientation.module').then(
        m => m.OrientationPageModule
      )
  },
  // {
  //   path: 'dossier-detail/:idPatient',
  //   loadChildren: () => import('./dossier/dossier-detail/dossier-detail.module').then( m => m.DossierDetailPageModule)
  // }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
