import { Component, OnInit } from "@angular/core";
import { ServiceAppService } from "src/app/services/service-app.service";
import { GlobalvarsService } from "src/app/services/globalvars.service";
import { ActivatedRoute, Router } from "@angular/router";
import {
  LoadingController,
  AlertController,
  ModalController
} from "@ionic/angular";
import { EtabResponseData } from "src/app/models/etab.response";
import { ImagePage } from "../../modal/image/image.page";
import { ListeMedByCRModel } from "src/app/models/listeMedByCr.model";
import { Observable } from "rxjs";
import { DemandeAvisResponseData } from "src/app/models/DemandeAvis.response";
import { ReponseAvisResponseData } from "src/app/models/reponseAvis.response";
import { ReponseAvisModel } from "src/app/models/reponseAvis.model";
import { DossierModel } from "src/app/models/dossier.model";

@Component({
  selector: "app-orientation",
  templateUrl: "./orientation.page.html",
  styleUrls: ["./orientation.page.scss"]
})
export class OrientationPage implements OnInit {
  idUser: number;
  idEtab: number;
  dossierId: number;
  stepId: number;
  token: string;
  etabName: string;
  itemsCR: any;
  idCr: number;
  lastCrName: string;
  reviewsList = 0;
  urlEcg: string;
  itemsMeds: ListeMedByCRModel;
  dataReponsesAvis: Array<ReponseAvisModel>;

  afficheListeCr = false;
  reviewsDecision = false;
  afficheReponseMed = false;

  demandeAvisId = 0;
  dataPatient: DossierModel;
  retunListeCR: EtabResponseData;

  constructor(
    private srvApp: ServiceAppService,
    private sglob: GlobalvarsService,
    private activatedroute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private router: Router,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.sglob.updateInitFetchHome(true);
    this.idUser = this.sglob.getIdUser();
    this.idEtab = this.sglob.getidEtab();
    this.token = this.sglob.getToken();
    this.activatedroute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("dataPatientObj")) {
        this.router.navigate(["/home"]);
      } else {
        const dataObj = paramMap.get("dataPatientObj");
        this.dataPatient = JSON.parse(dataObj);
        this.dossierId = this.dataPatient.dossierId;
        this.urlEcg = this.dataPatient["ecgImage"];
        this.demandeAvisId = this.dataPatient.LastDemandeAvisId;
        this.idCr = this.dataPatient.lastCrId;
        console.log("*************demandeAvisId :", this.demandeAvisId);
        const motifId = this.dataPatient.lastMotifId;

        if (this.dataPatient.stepId !== 6) {
          this.srvApp.stepUpdatePage(this.dossierId, 6, 1, this.token);
        }
        if (this.demandeAvisId > 0) {
          this.afficheListeCr = true;
          this.reviewsDecision = true;
          this.lastCrName = this.dataPatient["lastCrName"];
          this.reponseAvisCR(this.demandeAvisId);
        } else {
          // this.listeCr();
          this.onGetlistCr();
        }
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

  // ---------------------LIST CR------------------------------------------
  onGetlistCr() {
    this.loadingCtrl
      .create({ keyboardClose: true, message: "Opération  en cours..." })
      .then(loadingEl => {
        loadingEl.present();

        // 1 = CR / 2 = CUDT

        const authObs: Observable<EtabResponseData> = this.srvApp.getListeCR(1);
        // ---- Call getListeCR function
        authObs.subscribe(
          // :::::::::::: ON RESULT ::::::::::
          resData => {
            loadingEl.dismiss();
            if (+resData.code === 200) {
              this.itemsCR = resData.data;
              console.log("List Etab CR :", this.itemsCR);
              // ---------- DEMO DURATION ----------
              this.itemsCR.map(
                (m: { duration: string }) => (m.duration = "00:35:00")
              );
              // --------------------------------------

              // --------------DISPLAY CR LIST------------------------
              this.afficheListeCr = true;
              console.group("==== DATA onGetlistCr ====");
              console.log("this.afficheListeCr ::::", this.afficheListeCr);
              console.log(
                " this.afficheReponseMed ::::",
                this.afficheReponseMed
              );
              console.log(" this.reviewsList ::::", this.reviewsList);
              console.groupEnd();
            } else {
              this.sglob.showAlert("Erreur ", resData.message);
            }
          },
          errRes => {
            console.log("errRes :::>", errRes);
            // ----- Hide loader ------
            loadingEl.dismiss();
            // --------- Show Alert --------
            if (errRes.error.errors != null) {
              this.sglob.showAlert("Erreur ", errRes.error.errors.email);
            } else {
              this.sglob.showAlert(
                "Erreur !",
                "Prblème d'accès au réseau, veillez vérifier votre connexion"
              );
            }
          }
        );
      });
  }

  // ---------------------------------------------------------------

  toggleSelectionCr(idCr: number, etabName: string, index: number) {
    console.log("idrc ====> ", idCr);
    console.log("index ====> ", index);
    this.etabName = etabName;
    this.idCr = idCr;
    this.dataPatient.lastCrId = idCr;

    // # ====== Add color to selected CR item ==========
    this.itemsCR[index].open = !this.itemsCR[index].open;
    if (this.itemsCR && this.itemsCR[index].open) {
      this.itemsCR
        .filter((item: any, itemIndex: any) => itemIndex !== index)
        .map((item: any) => {
          item.open = false;
        });
    }
  }

  demandeAvisCr(idCr: number, etabName: string, index: number) {
    this.toggleSelectionCr(idCr, etabName, index);
    // -------------------------------------------
    console.log("demandeAvisCr idrc ===== ", idCr);

    this.dataPatient.lastCrName = etabName;
    this.lastCrName = etabName;
    this.reviewsDecision = true;

    this.loadingCtrl
      .create({ keyboardClose: true, message: "Opération  en cours..." })
      .then(loadingEl => {
        loadingEl.present();

        const params = {
          doctorId: this.idUser,
          cudtId: this.idEtab,
          crId: idCr,
          dossierId: this.dossierId,
          motifId: 1
        };
        // ---- Call demandeAvis API
        const authObs: Observable<DemandeAvisResponseData> = this.srvApp.demandeAvis(
          params,
          this.token
        );
        authObs.subscribe(
          // :::::::::::: ON RESULT ::::::::::
          resData => {
            // ----- Hide loader ------
            loadingEl.dismiss();

            if (+resData.code === 201) {
              this.afficheListeCr = false;
              this.afficheReponseMed = true;

              // ------------------------------------------
              this.demandeAvisId = resData.data.demandeId;
              this.dataPatient["LastDemandeAvisId"] = this.demandeAvisId;
            } else {
              this.sglob.showAlert("Erreur ", resData.message);
            }
          },

          // ::::::::::::  ON ERROR ::::::::::::
          errRes => {
            console.log(errRes);
            // ----- Hide loader ------
            loadingEl.dismiss();
            // --------- Show Alert --------
            if (errRes.error.errors != null) {
              this.sglob.showAlert("Erreur ", errRes.error.errors.email);
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

  reponseAvisCR(demandeAvisId: number) {
    console.log("*****reponseAvis cr ******", demandeAvisId);

    this.loadingCtrl
      .create({ keyboardClose: true, message: "opération  en cours..." })
      .then(loadingEl => {
        loadingEl.present();
        // ---- Call reponseDemandeAvis API
        const authObs: Observable<ReponseAvisResponseData> = this.srvApp.reponseDemandeAvis(
          demandeAvisId,
          this.token
        );
        authObs.subscribe(
          // :::::::::::: ON RESULT ::::::::::
          resData => {
            // ----- Hide loader ------
            loadingEl.dismiss();

            if (+resData.code === 200) {
              this.dataReponsesAvis = resData.data;

              console.log("this.dataReponsesAvis === ", this.dataReponsesAvis);

              // ------- HIDE CR LIST / SHOW DOCTORS REVIEWS LIST-------
              this.afficheListeCr = false;
              this.afficheReponseMed = true;
              this.reviewsList = this.dataReponsesAvis.length;

              console.group("==== DATA reponseAvisCR ====");
              console.log("this.afficheListeCr ::::", this.afficheListeCr);
              console.log(
                " this.afficheReponseMed ::::",
                this.afficheReponseMed
              );
              console.log(" this.reviewsList ::::", this.reviewsList);
              console.groupEnd();

              // ------------------------------------------
            } else {
              this.sglob.showAlert("Erreur ", resData.message);
            }
          },
          // ::::::::::::  ON ERROR ::::::::::::
          errRes => {
            console.log(errRes);
            // ----- Hide loader ------
            loadingEl.dismiss();
            // --------- Show Alert --------
            if (errRes.error.errors != null) {
              this.sglob.showAlert("Erreur ", errRes.error.errors.email);
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

  /*
  getListDoctorCr(idCr: number) {

    // http://cardio.cooffa.shop/api/etablissements/1/medecins
    console.log('*****getListDoctorCr ID CR = ******', idCr);

    this.loadingCtrl
      .create({ keyboardClose: true, message: 'opération  en cours...' })
      .then(loadingEl => {
        loadingEl.present();
        // ---- Call reponseDemandeAvis API
        const authObs: Observable<ListeMedByCRResponseData> = this.srvApp.listeMedByCr(
          idCr,
          this.token
        );
        authObs.subscribe(
          // :::::::::::: ON RESULT ::::::::::
          resData => {
            // ----- Hide loader ------
            loadingEl.dismiss();

            if (+resData.code === 200) {
              this.dataReponsesMedCr = resData.data;
              // ------------------------------------------
            } else {
              loadingEl.dismiss();
              this.sglob.showAlert('Erreur ', resData.message);
            }
          },
          // ::::::::::::  ON ERROR ::::::::::::
          errRes => {
            console.log(errRes);
            // ----- Hide loader ------
            loadingEl.dismiss();
            // --------- Show Alert --------
            if (errRes.error.errors != null) {
              this.sglob.showAlert('Erreur ', errRes.error.errors.email);
            } else {
              this.sglob.showAlert(
                'Erreur ',
                'Prblème d\'accès au réseau, veillez vérifier votre connexion'
              );
            }
          }
        );
      });
  }
*/

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
            if (diag === "RAS") {
              await this.router.navigate([
                "/ras",
                this.dossierId,
                JSON.stringify(this.dataPatient)
              ]);
            } else {
              await this.router.navigate([
                "/pretreatment",
                this.dossierId,
                JSON.stringify(this.dataPatient)
              ]);
            }
          }
        }
      ]
    });
    await alert.present();
  }
  decision() {
    console.log("orientation vers datapatient diag ===>", this.dataPatient);
    this.router.navigate([
      "./diagnostic",
      this.dossierId,
      JSON.stringify(this.dataPatient)
    ]);
  }
}
