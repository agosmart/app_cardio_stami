import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
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
    path: "orientation/:idDossier/:dataPatientObj",
    loadChildren: () =>
      import("./dossier/orientation/orientation.module").then(
        m => m.OrientationPageModule
      )
  },
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
    path: "gocr/:idDossier/:resultatId/:dataPatientObj",
    loadChildren: () =>
      import("./intervention/gocr/gocr.module").then(m => m.GocrPageModule)
  },
  {
    path: "engio/:idDossier/:dataPatientObj",
    loadChildren: () =>
      import("./intervention/engio/engio.module").then(m => m.EngioPageModule)
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
    path: "last-drug/:idDossier/:idCr/:dataPatientObj",
    loadChildren: () =>
      import("./intervention/last-drug/last-drug.module").then(
        m => m.LastDrugPageModule
      )
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
