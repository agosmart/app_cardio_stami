import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "onboard", pathMatch: "full" },
  {
    path: "home",
    loadChildren: () => import("./home/home.module").then(m => m.HomePageModule)
  },

  /**********************************************
                  - INTRO APP
  ************************************************/
  {
    path: "onboard",
    loadChildren: () =>
      import("./onboard/onboard.module").then(m => m.OnboardPageModule)
  },

  /**********************************************
              - AUTHENTICATION USER
  ************************************************/
  // # LOGIN USER
  {
    path: "login",
    loadChildren: () =>
      import("./authentication/login/login.module").then(m => m.LoginPageModule)
  },
  // # REGISTER USER
  {
    path: "register",
    loadChildren: () =>
      import("./authentication/register/register.module").then(
        m => m.RegisterPageModule
      )
  },
  // # RESET PASSWORD
  {
    path: "reset",
    loadChildren: () =>
      import("./authentication/reset/reset.module").then(m => m.ResetPageModule)
  },

  /**********************************************
          - CREATION DU DOSSIER PATIENT
  ************************************************/
  // # 1 - INSCRIPTION INITIALE
  {
    path: "inscription",
    loadChildren: () =>
      import("./dossier/inscription/inscription.module").then(
        m => m.InscriptionPageModule
      )
  },
  // # 2 - INSCRIPTION ECG
  {
    path: "",
    children: [
      {
        path: "insc-ecg/:dataPatientObj",
        loadChildren: () =>
          import("./dossier/inscription/insc-ecg/insc-ecg.module").then(
            m => m.InscEcgPageModule
          )
      },
      {
        // path: 'insc-infos/:objetInsc',
        //path: "insc-infos/:idDossier",
        path: "insc-infos/:idDossier/:dataPatientObj",
        loadChildren: () =>
          import("./dossier/inscription/insc-infos/insc-infos.module").then(
            m => m.InscInfosPageModule
          )
      }
    ]
  },
  // # 3 - DIAGNOSTIC
  {
    path: "diagnostic/:idDossier/:dataPatientObj",
    loadChildren: () =>
      import("./dossier/diagnostic/diagnostic.module").then(
        m => m.DiagnosticPageModule
      )
  },
  // # 4 - ORIENTATION
  {
    path: "ras/:idDossier/:dataPatientObj",
    loadChildren: () =>
      import("./cloture/ras/ras.module").then(m => m.RasPageModule)
  },
  {
    path: "image",
    loadChildren: () =>
      import("./modal/image/image.module").then(m => m.ImagePageModule)
  },
  {
    path: "pretreatment/:idDossier/:dataPatientObj",
    loadChildren: () =>
      import("./treatment/pretreatment/pretreatment.module").then(
        m => m.PretreatmentPageModule
      )
  },
  {
    path: "intervention/:idDossier/:dataPatientObj",
    // path: "intervention",
    loadChildren: () =>
      import("./intervention/intervention.module").then(
        m => m.InterventionPageModule
      )
  },
  {
    path: "thromb-absolut/:idDossier/:dataPatientObj",
    loadChildren: () =>
      import("./intervention/thromb-absolut/thromb-absolut.module").then(
        m => m.ThrombAbsolutPageModule
      )
  },
  {
    path: "thromb-relative/:idDossier/:dataPatientObj",
    loadChildren: () =>
      import("./intervention/thromb-relative/thromb-relative.module").then(
        m => m.ThrombRelativePageModule
      )
  },
  {
    path: "thromb-sos/:idDossier/:dataPatientObj",
    loadChildren: () =>
      import("./intervention/thromb-sos/thromb-sos.module").then(
        m => m.ThrombSosPageModule
      )
  },
  {
    path: "last-drug/:idDossier/:dataPatientObj",
    loadChildren: () =>
      import("./intervention/last-drug/last-drug.module").then(
        m => m.LastDrugPageModule
      )
  },
  {
    path: "thromb-ecg/:idDossier/:dataPatientObj",
    loadChildren: () =>
      import("./intervention/thromb-ecg/thromb-ecg.module").then(
        m => m.ThrombEcgPageModule
      )
  },
  {
    path: "thromb-protoc/:idDossier/:dataPatientObj",
    loadChildren: () =>
      import("./intervention/thromb-protoc/thromb-protoc.module").then(
        m => m.ThrombProtocPageModule
      )
  },
  {
    path: "orientation-sos/:idDossier/:dataPatientObj",
    loadChildren: () =>
      import("./intervention/orientation-sos/orientation-sos.module").then(
        m => m.OrientationSosPageModule
      )
  },
  {
    path: "thromb-result/:idDossier/:dataPatientObj",
    loadChildren: () =>
      import("./intervention/thromb-result/thromb-result.module").then(
        m => m.ThrombResultPageModule
      )
  },
  {
    path: "orientation-st/:idDossier/:dataPatientObj",
    loadChildren: () =>
      import("./intervention/orientation-st/orientation-st.module").then(
        m => m.OrientationStPageModule
      )
  },
  {
    path: "archive/:patientId/:pageOrig/:idDossierOrig/:dataPatientObj",
    loadChildren: () =>
      import("./archive/archive.module").then(m => m.ArchivePageModule)
  },
  {
    path: "detail-archive/:patientId",
    loadChildren: () =>
      import("./archive/detail-archive/detail-archive.module").then(
        m => m.DetailArchivePageModule
      )
  },
  {
    path: "treatment-engio/:idDossier/:dataPatientObj/:dataModalAvis",
    loadChildren: () =>
      import("./treatment/treatment-engio/treatment-engio.module").then(
        m => m.TreatmentEngioPageModule
      )
  },
  {
    path: "treatment-thromb/:idDossier/:dataPatientObj",
    loadChildren: () =>
      import("./treatment/treatment-thromb/treatment-thromb.module").then(
        m => m.TreatmentThrombPageModule
      )
  },
  {
    path: "list-cr",
    loadChildren: () =>
      import("./modal/list-cr/list-cr.module").then(m => m.ListCrPageModule)
  },
  {
    path: "avis-med",
    loadChildren: () =>
      import("./modal/avis-med/avis-med.module").then(m => m.AvisMedPageModule)
  },
  {
    path: "st/:idDossier/:dataPatientObj",
    loadChildren: () =>
      import("./cloture/st/st.module").then(m => m.StPageModule)
  },  {
    path: 'avis-sos',
    loadChildren: () => import('./modal/avis-sos/avis-sos.module').then( m => m.AvisSosPageModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
