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
import { DossierModel } from "src/app/models/dossier.model";
import { Observable } from "rxjs";
import { DemandeAvisResponseData } from "src/app/models/DemandeAvis.response";
import { ReponseAvisResponseData } from "src/app/models/reponseAvis.response";
import { ReponseAvisModel } from "src/app/models/reponseAvis.model";

@Component({
  selector: "app-engio",
  templateUrl: "./engio.page.html",
  styleUrls: ["./engio.page.scss"]
})
export class EngioPage implements OnInit {
  idUser: number;
  idEtab: number;
  dossierId: number;
  token: string;
  resultName: string;
  idCr = 0;
  stepId = 0;
  isLoading = false;
  resultatId: number;
  dataPatient: DossierModel;
  retunListeCR: EtabResponseData;
  itemsCR: any;
  etabName: string;
  urlEcg: string;
  lastCrName: string;
  reviewsDecision = false;
  demandeAvisId = 0;
  afficheListeCr = false;
  afficheReponseMed = false;
  reviewsList = 0;
  thromb = true;
  dataReponsesAvis: Array<ReponseAvisModel>;

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
        this.demandeAvisId = this.dataPatient.LastDemandeAvisId;

        this.dossierId = this.dataPatient.dossierId;
        this.resultName = this.dataPatient.resultName;
        this.idCr = this.dataPatient.lastCrId;
        this.urlEcg = this.dataPatient["ecgImage"];
        console.log(" gocr  >>>>> dataPatients ::: ", this.dataPatient);
        console.log("resultName", this.resultName);

        if (this.dataPatient.stepId !== 15) {
          this.srvApp.stepUpdatePage(this.dossierId, 15, 14, this.token);
        }

        if (this.demandeAvisId > 0) {
          this.afficheListeCr = false;
          this.reviewsDecision = true;
          this.thromb = false;
          this.reponseAvisCR(this.demandeAvisId);
        } else {
          // this.listeCr();
          this.getlisteCrById();
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

  getlisteCrById() {
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
              this.afficheListeCr = true;
              this.itemsCR = resData.data;
              console.log("List Etab CR :", this.itemsCR);
              // ---------- DEMO DURATION ----------
              const times = ["< 120 min", "> 120 min"];

              this.itemsCR.map((m: { duration: string }) => {
                const rand = Math.floor(Math.random() * times.length);
                m.duration = times[rand];
              });
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

  /*
    listeCr() {
        this.srvApp.getListeCR(1).subscribe((resp: any) => {
        this.retunListeCR = resp;
        console.log('return liste cr', this.retunListeCR);
        console.log('return liste code', this.retunListeCR.code);
        // this.retunListeCR.code = 200; // a enlever
        if (+this.retunListeCR.code === 200) {
          this.itemsCR = this.retunListeCR.data;
          console.log('nom etab cr', this.retunListeCR.data);
        } else {
          console.log('no');
        }
      });
    }


    choixCr(idCr: number, etabName: string, index: number) {
      console.log('idrc ====> ', idCr);
      console.log('index ====> ', index);
      this.idCr = idCr;
      this.etabName = etabName;
    }
   */

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
        .filter((item, itemIndex: any) => itemIndex !== index)
        .map((item: any) => {
          item.open = false;
        });
    }
  }

  demandeAvisCr(idCr: number, etabName: string, index: number) {
    if (this.idCr > 0) {
      this.sglob.showAlert("Erreur ", "Une demande avis a été déjà envoyé");
    } else {
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
            motifId: 3
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
                this.thromb = false;

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

    //0
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

  async goToCR() {
    console.log("envoiCR  ====> ", this.idCr);
    console.log("envoi vers cr idrc ", this.idCr);
    this.dataPatient.resultId = 7; //  300 plavix
    this.dataPatient.idCr = this.idCr; //  id cr choisit
    this.dataPatient.stepId = 15;

    await this.router.navigate([
      "/last-drug",
      this.dossierId,
      JSON.stringify(this.dataPatient)
    ]);
  }
  async goToTrombo() {
    this.dataPatient.resultId = 13;
    await this.router.navigate([
      "/thromb-absolut",
      this.dossierId,
      JSON.stringify(this.dataPatient)
    ]);
  }

  async showAlertConfirme() {
    if (this.idCr > 0) {
      let msgAlert = "";
      // ----------- message dynamic ---------------
      msgAlert =
        "Etes-vous sur de vouloire cloturer le dossier et envoyer le patient au CR " +
        this.etabName +
        "? ";
      // ---------------------------------------------
      this.stepId = 11;

      console.log("msgAlert ::::", msgAlert);
      // -----------END  message dynamic ---------------
      const alert = await this.alertCtrl.create({
        header: "Résultat validation choix",
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
              this.goToCR();
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.sglob.showAlert(
        "Attention!",
        "Vous devez choisir un Centre de référence!"
      );
    }
  }
}
