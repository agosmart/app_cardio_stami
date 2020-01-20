import { Component, OnInit } from "@angular/core";
import { ServiceAppService } from "src/app/services/service-app.service";
import { GlobalvarsService } from "src/app/services/globalvars.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LoadingController, AlertController } from "@ionic/angular";
import { EtabResponseData } from "src/app/models/etab.response";

import { ListeMedByCRModel } from "src/app/models/listeMedByCr.model";
import { Observable } from "rxjs";
import { DemandeAvisResponseData } from "src/app/models/DemandeAvis.response";
import { ReponseAvisResponseData } from "src/app/models/reponseAvis.response";
import { ReponseAvisModel } from "src/app/models/reponseAvis.model";

import { DossierModel } from "src/app/models/dossier.model";
import { ClotureResponseData } from "src/app/models/cloture.response";

@Component({
  selector: "app-envoi-cr",
  templateUrl: "./envoi-cr.page.html",
  styleUrls: ["./envoi-cr.page.scss"]
})
export class EnvoiCrPage implements OnInit {
  idUser: number;
  idEtab: number;
  dossierId: number;
  token: string;
  etabName: string;
  lastCrName: string;
  idCr: number;
  motifId: number;
  itemsCR: any;
  itemsMeds: ListeMedByCRModel;
  dataReponsesAvis: Array<ReponseAvisModel>;
<<<<<<< HEAD

  afficheListeCr = false;
=======
  afficheListeCr = 0;
>>>>>>> H: notification reception
  afficheReponseMed = 0;
  demandeAvisId = 0;
  dataPatient: DossierModel;
  // retunListeCR: EtabResponseData;
  returnClotureDossier: any;

  constructor(
    private srvApp: ServiceAppService,
    private sglob: GlobalvarsService,
    private activatedroute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
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
        this.lastCrName = this.dataPatient.lastCrName;
        this.motifId = this.dataPatient.lastMotifId;

        if (this.dataPatient.stepId !== 13) {
          this.srvApp.stepUpdatePage(this.dossierId, 13, 9, this.token);
        }
        console.log("demandeAvisId", this.demandeAvisId);
        if (this.demandeAvisId > 0 && this.motifId === 3) {
          this.afficheListeCr = 1;
          this.reponseAvisCR(this.demandeAvisId);
        } else {
          this.onGetlistCr();
        }
      }
    });
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
    console.log("demandeAvisId ====> ", this.demandeAvisId);

    if (this.demandeAvisId > 0 && this.motifId === 3) {
      this.sglob.showAlert(
        "Attention  !",
        "Une demande d`avis pour réception a été déjà envoyé"
      );
    } else {
      console.log("<==== demandeAvisId ====> ", this.demandeAvisId);
      console.log("idrc ====> ", idCr);
      console.log("index ====> ", index);
      this.etabName = etabName;
      this.idCr = idCr;

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
  }

  demandeAvisCr(idCr: number, etabName: string, index: number) {
    // # ====== Add color to selected CR item ==========
    this.toggleSelectionCr(idCr, etabName, index);
    // --------------------------------------------
    this.afficheListeCr = 1;
    this.dataPatient.lastCrName = etabName;
    this.lastCrName = etabName;

    console.log("demandeAvisCr idrc ", idCr);

    this.loadingCtrl
      .create({ keyboardClose: true, message: "opération  en cours..." })
      .then(loadingEl => {
        loadingEl.present();

        const params = {
          doctorId: this.idUser,
          cudtId: this.idEtab,
          crId: idCr,
          dossierId: this.dossierId,
          motifId: "3"
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
              // this.etabName = this.itemsMeds[0]["etabName"];
              this.afficheReponseMed = 1;
              console.log(" resData", resData.data);
              console.log(" resData demandeId", resData.data.demandeId);
              this.demandeAvisId = resData.data.demandeId;
              // this.reponseAvisCR(this.demandeAvisId);
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
                "Erreur !",
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
        // ---- Call Login function
        authObs.subscribe(
          // :::::::::::: ON RESULT ::::::::::
          resData => {
            // const dataResponse: UserModel = JSON.stringify(resData.data);
            // ----- Hide loader ------
            loadingEl.dismiss();

            if (+resData.code === 200) {
              this.dataReponsesAvis = resData.data;
              console.log("Response >>>>> ", this.dataReponsesAvis);
              if (Object.keys(this.dataReponsesAvis).length > 0) {
                console.log(
                  "taille data >>>>> ",
                  Object.keys(this.dataReponsesAvis).length
                );
                this.afficheReponseMed = 2;
              }
            } else {
              this.sglob.showAlert("Erreur ", resData.message);
            }
          },
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

  async showAlertConfirme(decision: string) {
    console.log("Confirme resultId ===>", this.dataPatient["resultId"]);
    let msgAlert = "";
    // ----------- message dynamic ---------------

    if (decision === "THROMB") {
      msgAlert = "Etes-vous sur de vouloir faire une Thromobolyse au patient?";
    } else if (decision === "CR") {
      msgAlert =
        "Etes-vous sur de vouloir envoyer le patient au CR  " +
        this.etabName +
        "? ";
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
            if (
              this.dataPatient["resultId"] === 8 ||
              this.dataPatient["resultId"] === 9
            ) {
              // this.dataPatient.stepId = 13;

              // this.dataPatient.resultId = this.resultId;
              this.router.navigate([
                "/last-drug",
                this.dossierId,
                JSON.stringify(this.dataPatient)
              ]);
            } else {
              this.clotureDossier(this.dataPatient["resultId"]);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  clotureDossier(resultatIdVal) {
    this.loadingCtrl
      .create({ keyboardClose: true, message: "Clôture en cours..." })
      .then(loadingEl => {
        loadingEl.present();
        const params = {
          dossierId: this.dossierId,
          resultatId: resultatIdVal,
          crId: this.idCr,
          plavix: "0",
          angio: "1",
          doctorId: this.dataPatient.doctorId
        };

        const authObs: Observable<ClotureResponseData> = this.srvApp.clotureDossier(
          params,
          this.token
        );
        authObs.subscribe(
          resData => {
            this.returnClotureDossier = resData.data;
            // ----- Hide loader ------
            loadingEl.dismiss();

            if (+resData.code === 201) {
              this.sglob.updateInitFetchHome(true);
              console.log(" diag getInitFetch ", this.sglob.getInitFetch());
              this.router.navigate(["/home"]);

              // this.isCloture = true;
            } else {
              // ----- Hide loader ------
              loadingEl.dismiss();
              this.sglob.showAlert("Erreur ", "Problème intèrne !!!");
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
                "Problème d'accès au réseau, veillez vérifier votre connexion"
              );
            }
          }
        );
      });
  }
}
