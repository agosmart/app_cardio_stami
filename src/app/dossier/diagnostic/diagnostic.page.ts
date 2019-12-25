import { Component, OnInit } from "@angular/core";
import { ServiceAppService } from "src/app/services/service-app.service";
import { GlobalvarsService } from "src/app/services/globalvars.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DossierModel } from "src/app/models/dossier.model";
import {
  ModalController,
  LoadingController,
  AlertController,
  ToastController
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
  idUser: number;
  stepId: number;
  returnDiag: DiagResponseData;

  // -----------------------------
  msgAlert = "";

  ecgImage = "/assets/images/ecg.jpg";

  constructor(
    private srv: ServiceAppService,
    private sglob: GlobalvarsService,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.token = this.sglob.getToken();
    this.idUser = this.sglob.getIdUser();
  }

  ngOnInit() {
    this.activatedroute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("dataPatientObj")) {
        this.router.navigate(["/home"]);
      } else {
        const dataObj = paramMap.get("dataPatientObj");
        this.dataPatient = JSON.parse(dataObj)[0];
        // console.log(
        //   ' DIAGNOSTIC  recu diag >>>>> dataPatient ::: ',
        //   this.dataPatient
        // );
      }

      if (!paramMap.has("idDossier")) {
        this.router.navigate(["/home"]);
      } else {
        this.idDossier = +paramMap.get("idDossier");
        this.ecgTmp = this.dataPatient["ecgTmp"];
      }
    });
  }

  async openImageEcg(image: any) {
    console.log("image ::::", image);
    const modal = await this.modalCtrl.create({
      component: ImagePage,
      componentProps: { value: image }
    });
    return await modal.present();
  }

  /* =================================
            setDiagnostic()
      -------- RAS /  SOS / ST ---------
     ================================= */
  /*
    setDiagnostic(diag: string) {
  
      switch (diag) {
  
        case 'RAS':
          // ---- RAS ---
          console.log('dataPatientObj ::::----> RAS', this.dataPatient);
         // this.router.navigate(['/ras', this.idDossier, JSON.stringify(this.dataPatient)]);
          break;
  
        case 'SOS':
          // ---- SOS ---
          console.log('dataPatientObj ::::----> SOS', this.dataPatient);
        //  this.router.navigate(['orientation', JSON.stringify(this.dataPatient)]);
          break;
  
        case 'ST':
          // ---- ST ---
          console.log('dataPatientObj ::::----> ST', this.dataPatient);
         // this.router.navigate(['/pretreatment', JSON.stringify(this.dataPatient)]);
          break;
  
        default:
          this.router.navigate(['/home']);
          break;
      }
      */

  // ===============  PUBLIC SHow Alert ===============
  // showAlert(message: string) {
  //   this.alertCtrl
  //     .create({
  //       header: 'Résultat d'authentication',
  //       message: message,
  //       cssClass: 'alert-css',
  //       buttons: ['Okay']
  //     })
  //     .then(alertEl => alertEl.present());
  // }

  // getDataPatient(id: number) {
  //   console.log('************id==>', id);
  //   return {
  //     ...this.dataPatients.find(dossier => {
  //       return dossier['id_dossier'] === id;
  //     })
  //   };
  // }

  /* =================================
           setDiagnosticAlert()
     -------- RAS /  SOS / ST ---------
   ================================= */

  onSetDiagnostic(diag: string) {
    console.log("diag ::::----> diag", diag);
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
        // ---- Call Login function
        authObs.subscribe(
          resData => {
            this.returnDiag = resData;
            console.log("RETOUR DATA DIAGNOSTIC:::", this.returnDiag.code);

            if (+this.returnDiag.code === 202) {
              loadingEl.dismiss();
              this.setDiagnostic(diag);
            } else {
              loadingEl.dismiss();
              this.msgAlert = "Prblème interne, veuillez réessyer";
              this.showAlert(this.msgAlert);
            }
          },
          errRes => {
            loadingEl.dismiss();
            if (errRes.error.status === 401 || errRes.error.status === 500) {
              this.msgAlert = "Accès à la ressource refusé";
              this.showAlert(this.msgAlert);
            } else {
              console.log("RETOUR ERROR DIAGNOSTIC:::", errRes);
              this.msgAlert =
                "Prblème d'accès au réseau, veillez vérifier votre connexion";
              this.showAlert(this.msgAlert);
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
            }
            await this.onSetDiagnostic(diag);
          }
        }
      ]
    });
    await alert.present();
  }

  // --------- ALERT -----------
  async showAlert(message: string) {
    // -----------END  message dynamic ---------------
    const alert = await this.alertCtrl.create({
      header: "Résultat d'authentication",
      message: message,
      cssClass: "alert-css",
      buttons: [
        {
          text: "Annuler",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirme Annuler");
          }
        }
      ]
    });
    await alert.present();
  }

  // =================================
  //  setDiagnostic()
  // =================================

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
          "orientation",
          JSON.stringify(this.dataPatient)
        ]);
        break;

      case "ST":
        // ---- ST ---
        console.log("dataPatientObj ::::----> ST", this.dataPatient);
        await this.router.navigate([
          "/pretreatment",
          JSON.stringify(this.dataPatient)
        ]);
        break;

      default:
        this.router.navigate(["/home"]);
        break;
    }
  }

  /*
    async setDiagnosticAlert_(diag: string) {
  
      // ----------- message dynamic ---------------
      if (diag === 'ST') {
        this.msgAlert = "Etes-vous sur qu'il existe un facteur de risque d'infarctus connu au moment de diagnostic?";
      } else if (diag === 'RAS') {
        this.msgAlert = "Etes-vous sur qu'il n'existe aucun facteur de risque d'infarctus connu au moment de diagnostic ? ";
      } else {
        this.msgAlert = "Etes-vous sur de bien vouloir lancer une demande d'aide auprès de vos collègues ? ";
      }
      // -----------END  message dynamic ---------------
  
      const alert = await this.alertCtrl.create({
        header: 'Le constat des risques',
        cssClass: 'alert-css',
        // ----------- message dynamic ---------------
        message: this.msgAlert,
        // -------------------------
        buttons: [
          {
            text: 'Annuler',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirme Annuler');
            }
          }, {
            text: 'Je confirme',
            handler: async () => {
              const loader = await this.loadingCtrl.create({
                duration: 8000,
                message: 'Envoie en cours...',
                translucent: true,
                cssClass: 'custom-class custom-loading',
              });
              await loader.present();
              // ----------- params test  ---------------
              const params = {
  
                dossierId: '',
                doctorId: '',
                diagnostic: '',
                stepId: '',
              };
              // ----------- END params test  ---------------
              const authObs: Observable<DiagResponseData> = this.srv.diagDossier(params, this.token);
              // ---- Call Login function
              authObs.subscribe(
                // :::::::::::: ON RESULT ::::::::::
                resData => {
                  this.returnDiag = resData;
                  console.log('RETOUR DATA DIAGNOSTIC:::', this.returnDiag.code);
  
                  if (+this.returnDiag.code === 202) {
                    // loader.dismiss();
                    this.msgAlert = 'Votre diagnostic sur l\'état du patient a été prise en considération.';
  
                  } else {
                    // loader.dismiss();
                    this.msgAlert = 'Prblème interne, veilley réessyer';
                  }
                },
                errRes => {
                  if (errRes.error.status === 401 || errRes.error.status === 500) {
                    this.msgAlert = "Accès à la ressource refusé";
  
                  }
                  // loader.dismiss();
                  console.log('RETOUR ERROR DIAGNOSTIC:::', errRes);
                  this.msgAlert = "Prblème d'accès au réseau, veillez vérifier votre connexion";
  
  
                });
  
              await loader.dismiss().then((l) => {
                this.setDiagnostic(diag);
              });
  
            }
          }
        ]
      });
      await alert.present();
    }
  
  */

  /* *********** END **************** */
}
