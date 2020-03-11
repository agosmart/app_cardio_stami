import { Component, OnInit } from "@angular/core";
import { ServiceAppService } from "src/app/services/service-app.service";
import { GlobalvarsService } from "src/app/services/globalvars.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ImagePage } from "../../modal/image/image.page";
import {
  LoadingController,
  AlertController,
  ModalController
} from "@ionic/angular";
import { EtabResponseData } from "src/app/models/etab.response";
import { ListeMedByCRResponseData } from "src/app/models/listeMedByCr.response";
import { ListeMedByCRModel } from "src/app/models/listeMedByCr.model";
import { Observable } from "rxjs";
import { DemandeAvisResponseData } from "src/app/models/DemandeAvis.response";
import { ReponseAvisResponseData } from "src/app/models/reponseAvis.response";
import { ReponseAvisModel } from "src/app/models/reponseAvis.model";
import { DossierResponseData } from "src/app/models/dossier.response";
import { DossierModel } from "src/app/models/dossier.model";

@Component({
  selector: "app-thromb-sos",
  templateUrl: "./thromb-sos.page.html",
  styleUrls: ["./thromb-sos.page.scss"]
})
export class ThrombSosPage implements OnInit {
  idUser: number;
  idEtab: number;
  dossierId: number;
  token: string;
  urlEcg: string;
  itemsCR: any;
  itemsMeds: ListeMedByCRModel;
  dataReponsesAvis: Array<ReponseAvisModel>;
  afficheReponseMed = 0;
  afficheButtonCR = 0;
  lastCrName: string;
  idCr: number;
  gender: number;

  demandeAvisId = 0;
  etabName = "abc";
  dataPatient: DossierModel;
  retunListeCR: EtabResponseData;

  reviewsList = 0;
  afficheListeCr = false;

  constructor(
    private srvApp: ServiceAppService,
    private sglob: GlobalvarsService,
    private activatedroute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
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
        this.demandeAvisId = this.dataPatient.LastDemandeAvisId;
        this.idCr = this.dataPatient.lastCrId;
        const motifId = this.dataPatient.lastMotifId;
        this.gender = this.dataPatient.gender;
        this.urlEcg = this.dataPatient["ecgImage"];
        if (this.dataPatient.stepId !== 19) {
          this.srvApp.stepUpdatePage(this.dossierId, 19, 9, this.token, 20);
        }
        console.log("demandeAvisId", this.demandeAvisId);
        if (this.demandeAvisId > 0 && motifId === 2) {
          // this.afficheReponseMed = 2;
          this.afficheButtonCR = 1;
          this.lastCrName = this.dataPatient.lastCrName;
          this.reponseAvisCR(this.demandeAvisId);
        } else {
          // this.listeCr();
          this.onGetlistCr();
        }
      }
      // 1 c les CR  2 CUDT
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

  /*listeCr() {
    this.srvApp.getListeCR(1).subscribe((resp: any) => {
      this.retunListeCR = resp;
      console.log("return liste cr", this.retunListeCR);
      console.log("return liste code", this.retunListeCR.code);
      // this.retunListeCR.code = 200; // a enlever
      if (+this.retunListeCR.code === 200) {
        this.itemsCR = this.retunListeCR.data;
        console.log("nom etab cr", this.retunListeCR.data);

        // ---------- DEMO DURATION ----------
        this.itemsCR.map((m: { duration: string; }) => m.duration = '00:35:00');
        // --------------------------------------

      } else {
        console.log("no");
      }
    });
  }*/

  onGetlistCr() {
    this.loadingCtrl
      .create({ keyboardClose: true, message: "Opération  en cours..." })
      .then(loadingEl => {
        loadingEl.present();

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

              // --------------DISPLAY CR LIST------------------------
              this.afficheListeCr = true;
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

  toggleSelectionCr(index: number) {
    console.log("index ====> ", index);
    // # ====== Add color to selected CR item ==========
    this.itemsCR[index].open = !this.itemsCR[index].open;
    if (this.itemsCR && this.itemsCR[index].open) {
      this.itemsCR
        .filter((item, itemIndex: any) => itemIndex !== index)
        .map((item: any) => {
          item.open = false;
        });
    }
  }

  demandeAvisCr(idCr: number, index: number, etabName: string) {
    // # ====== Add color to selected CR item ==========
    this.toggleSelectionCr(index);
    // -------------------------------------------
    console.log("demandeAvisCr idrc ", idCr);

    this.dataPatient.lastCrId = idCr;
    this.dataPatient.lastCrName = etabName;
    this.lastCrName = etabName;
    this.afficheButtonCR = 1;
    this.afficheReponseMed = 1;

    this.loadingCtrl
      .create({ keyboardClose: true, message: "Opération  en cours..." })
      .then(loadingEl => {
        loadingEl.present();

        const params = {
          doctorId: this.idUser,
          cudtId: this.idEtab,
          crId: idCr,
          dossierId: this.dossierId,
          motifId: 2
        };

        const authObs: Observable<DemandeAvisResponseData> = this.srvApp.demandeAvis(
          params,
          this.token
        );
        // ---- Call Login function
        authObs.subscribe(
          // :::::::::::: ON RESULT ::::::::::
          resData => {
            // ----- Hide loader ------
            loadingEl.dismiss();

            if (+resData.code === 201) {
              // ------------ DISPLAY BLOC  LIST CR -------------------
              this.afficheListeCr = false;
              // --------------------------------
              console.log(" resData", resData.data);
              console.log(" resData demandeId", resData.data.demandeId);
              this.demandeAvisId = resData.data.demandeId;
              this.afficheReponseMed = 1;
              //this.reponseAvisCR(this.demandeAvisId);
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

  reponseAvisCR(demandeAvisId) {
    this.afficheReponseMed = 1;
    console.log("******************reponseAvis cr **", demandeAvisId);

    this.loadingCtrl
      .create({ keyboardClose: true, message: "opération  en cours..." })
      .then(loadingEl => {
        loadingEl.present();

        const authObs: Observable<ReponseAvisResponseData> = this.srvApp.reponseDemandeAvis(
          demandeAvisId,
          this.token
        );
        authObs.subscribe(
          resData => {
            loadingEl.dismiss();

            if (+resData.code === 200) {
              console.log("Response >>>>> ", this.dataReponsesAvis);
              this.dataReponsesAvis = resData.data;

              console.log(
                "reviewsList number >>>>> ",
                Object.keys(this.dataReponsesAvis).length
              );
              if (Object.keys(this.dataReponsesAvis).length > 0) {
                this.afficheReponseMed = 2;
                this.reviewsList = Object.keys(this.dataReponsesAvis).length;
              }
              // ---------------------------------
            } else {
              this.sglob.showAlert("Erreur ", resData.message);
            }
          },
          errRes => {
            console.log(errRes);
            // ----- Hide loader ------
            loadingEl.dismiss();
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

  async showAlertConfirme(decision: string) {
    let msgAlert = "";
    // ----------- message dynamic ---------------

    if (decision === "THROMB") {
      msgAlert = "Etes-vous sur de vouloir faire une Thromobolyse au patient?";
    } else if (decision === "CR") {
      msgAlert = "Etes-vous sur de vouloir envoyer le patient au CR ? ";
    }

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
            if (decision === "CR") {
              this.dataPatient.resultId = 9;
              // ************ REDIRECTION TO GOCR PAGE ****************
              this.router.navigate([
                "/envoi-cr",
                this.dossierId,
                JSON.stringify(this.dataPatient)
              ]);
            } else {
              this.router.navigate([
                "/thromb-ecg",
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
}
