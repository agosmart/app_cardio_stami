import { Component, OnInit } from "@angular/core";
import { ServiceAppService } from "src/app/services/service-app.service";
import { GlobalvarsService } from "src/app/services/globalvars.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DossierModel } from "src/app/models/dossier.model";
import {
  ModalController,
  LoadingController,
  ToastController,
  AlertController
} from "@ionic/angular";
import { ImagePage } from "../../modal/image/image.page";

import { Observable } from "rxjs";

import { PatientModel } from "src/app/models/patient.model";
import { PatientResponseData } from "src/app/models/patient.response";
import { DiagResponseData } from "src/app/models/diag.response";

@Component({
  selector: "app-diagnostic",
  templateUrl: "./diagnostic.page.html",
  styleUrls: ["./diagnostic.page.scss"]
})
export class DiagnosticPage implements OnInit {
  idDossierToGet: number;
  dataPatients: Array<DossierModel>;
  hasHistoric = false;
  dataPatient: object;
  ecgTmp: string;
  idDossier: number;
  token: string;
  pageOrig: string;
  idUser: number;
  stepId: number;
  patientId: number;
  returnDiag: DiagResponseData;
  urlEcg: string;

  // -----------------------------
  msgAlert = "";

  constructor(
    private srv: ServiceAppService,
    private sglob: GlobalvarsService,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {
    this.token = this.sglob.getToken();
    this.idUser = this.sglob.getIdUser();
  }

  ngOnInit() {
    this.sglob.updateInitFetchHome(true);
    console.log(" diag ionViewDidEnter after", this.sglob.getInitFetch());
    this.activatedroute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("dataPatientObj")) {
        this.router.navigate(["/home"]);
      } else {
        const dataObj = paramMap.get("dataPatientObj");
        console.log(" dataObj >>>>> dataPatient ::: ", dataObj);
        this.dataPatient = JSON.parse(dataObj);
        this.patientId = this.dataPatient["patientId"];
        this.pageOrig = this.dataPatient["page"];

        console.log(
          " DIAGNOSTIC  recu diag >>>>> dataPatient ::: ",
          this.dataPatient
        );
      }

      if (!paramMap.has("idDossier")) {
        this.router.navigate(["/home"]);
      } else {
        this.idDossier = +paramMap.get("idDossier");
        this.ecgTmp = this.dataPatient["ecgTmp"];
        this.urlEcg = this.dataPatient["ecgImage"];
        console.log(" urlEcg ::: ", this.urlEcg);
      }
    });
  }

  async openImageEcg() {
    console.log("image ::::", this.urlEcg);
    const modal = await this.modalCtrl.create({
      component: ImagePage,
      componentProps: { value: this.urlEcg }
    });
    return await modal.present();
  }
  /* =================================
           setDiagnosticAlert()
     -------- RAS /  SOS / ST ---------
   ================================= */

  onSetDiagnostic(diag: string) {
    console.log("onSetDiagnostic ::::----> diag", diag);
    this.loadingCtrl
      .create({ keyboardClose: true, message: "Opération en cours..." })
      .then(loadingEl => {
        loadingEl.present();
        // ----------- END PARAMS  ---------------
        const params = {
          dossierId: this.idDossier,
          doctorId: this.idUser,
          diagnostic: diag,
          stepId: this.stepId
        };

        const authObs: Observable<DiagResponseData> = this.srv.diagDossier(
          params,
          this.token
        );
        // ---- Call DIAGNOSTIC function
        authObs.subscribe(
          resData => {
            this.returnDiag = resData;

            if (+this.returnDiag.code === 202) {
              console.log("RETOUR DATA DIAGNOSTIC:::", this.returnDiag.code);
              loadingEl.dismiss();
              this.setDiagnostic(diag);
            } else {
              loadingEl.dismiss();
              this.sglob.showAlert(
                "Erreur ",
                "Prblème interne, veuillez réessyer"
              );
            }
          },
          errRes => {
            loadingEl.dismiss();
            if (errRes.error.status === 401 || errRes.error.status === 500) {
              this.sglob.showAlert("Erreur ", "Accès à la ressource refusé");
            } else {
              this.sglob.showAlert(
                "Erreur ",
                "Prblème d'accès au réseau, veillez vérifier votre connexion"
              );
            }
          }
        );
      });
  }
  // --------- ALERT CONFIRME -----------

  async showAlertConfirme(diag: string) {
    let msgAlert = "";
    // ----------- message dynamic ---------------

    if (diag === "ST") {
      this.stepId = 7;
      msgAlert =
        "Etes-vous sur qu'il existe un facteur de risque d'infarctus connu au moment de diagnostic?";
    } else if (diag === "RAS") {
      this.stepId = 10;
      msgAlert =
        "Etes-vous sur qu'il n'existe aucun facteur de risque d'infarctus connu au moment de diagnostic ? ";
    } else {
      this.stepId = 6;
      msgAlert =
        "Etes-vous sur de bien vouloir lancer une demande d'aide auprès de vos collègues ? ";
    }

    console.log("DIAG ::::", msgAlert);
    // -----------END  message dynamic ---------------
    const alert = await this.alertCtrl.create({
      header: "Résultat d'authentication",
      message: msgAlert,
      cssClass: "alert-css",
      buttons: [
        {
          text: "Annuler",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirme Annuler");
          }
        },
        {
          text: "Je confirme",
          handler: async () => {
            if (this.dataPatient["demandeAvisId"] !== 0 && diag === "SOS") {
              this.setDiagnostic("SOS");
            } else {
              await this.onSetDiagnostic(diag);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async setDiagnostic(diag: string) {
    switch (diag) {
      case "RAS":
        // ---- RAS ---
        console.log("dataPatientObj ::::----> RAS", this.dataPatient);
        await this.router.navigate([
          "/ras",
          this.idDossier,
          JSON.stringify(this.dataPatient)
        ]);
        break;

      case "SOS":
        // ---- SOS ---
        console.log(
          "dataPatientObj ::::----> SOS",
          this.dataPatient["demandeAvisId"]
        );
        // console.log("demandeAvisId ::::----> SOS", this.demandeAvisId);
        await this.router.navigate([
          "/orientation",
          this.idDossier,
          JSON.stringify(this.dataPatient)
        ]);
        break;

      case "ST":
        // ---- ST ---
        console.log(
          "dataPatientObj ::::----> ST DIAGNOSTIC ",
          this.dataPatient
        );
        await this.router.navigate([
          "/pretreatment",
          this.idDossier,
          JSON.stringify(this.dataPatient)
        ]);
        break;

      default:
        this.router.navigate(["/home"]);
        break;
    }
  }

  archive() {
    console.log(this.patientId);
    this.router.navigate([
      "/archive",
      this.patientId,
      this.pageOrig,
      this.idDossier,
      JSON.stringify(this.dataPatient)
    ]);
  }
}
