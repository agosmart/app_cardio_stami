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
import { ImagePage } from "src/app/modal/image/image.page";
import { AvisMedPage } from "src/app/modal/avis-med/avis-med.page";
import { ListCrPage } from "src/app/modal/list-cr/list-cr.page";
import { ListeMedByCRModel } from "src/app/models/listeMedByCr.model";
import { Observable } from "rxjs";
import { DemandeAvisResponseData } from "src/app/models/DemandeAvis.response";
import { ReponseAvisResponseData } from "src/app/models/reponseAvis.response";
import { ReponseAvisModel } from "src/app/models/reponseAvis.model";
import { DossierModel } from "src/app/models/dossier.model";

@Component({
  selector: "app-orientation-st",
  templateUrl: "./orientation-st.page.html",
  styleUrls: ["./orientation-st.page.scss"]
})
export class OrientationStPage implements OnInit {
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
  dataModalAvis = [];
  currentModal: any;
  motifId: number;

  afficheListeCr = false;
  reviewsDecision = false;
  afficheReponseMed = 0;

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

  ionViewDidEnter() {
    this.initialisation();
  }
  ngOnInit() {
    this.initialisation();
  }

  initialisation() {
    this.sglob.updateInitFetchHome(true);
    this.idUser = this.sglob.getIdUser();
    this.idEtab = this.sglob.getidEtab();
    this.token = this.sglob.getToken();
    this.dataPatient = this.srvApp.getExtras();
    console.log("===== dataPatient st get  ===", this.dataPatient);
    if (this.dataPatient) {
      this.dossierId = this.dataPatient["dossierId"];
      this.urlEcg = this.dataPatient["ecgImage"];
      this.demandeAvisId = this.dataPatient.LastDemandeAvisId;
      this.idCr = this.dataPatient.lastCrId;
      console.log("*************dataPatient :", this.dataPatient);
      this.motifId = this.dataPatient.lastMotifId;

      if (this.dataPatient.stepId !== 20) {
        this.srvApp.stepUpdatePage(
          this.dossierId,
          20,
          15,
          this.token,
          this.motifId
        );
      }
      if (this.demandeAvisId > 0) {
        this.afficheReponseMed = 1;
        this.reviewsDecision = true;
        this.lastCrName = this.dataPatient["lastCrName"];
        this.reponseAvisCR();
      }
    } else {
      this.router.navigate(["/home"]);
    }
  }
  async openImageEcg() {
    console.log("image ::::", this.urlEcg);
    const modal = await this.modalCtrl.create({
      component: ImagePage,
      componentProps: { value: this.urlEcg }
    });
    return await modal.present();
  }

  async afficherListeCrModal() {
    this.currentModal = null;
    console.log("image ::::", this.urlEcg);
    const modal = await this.modalCtrl.create({
      component: ListCrPage,
      componentProps: {
        idUser: this.idUser,
        idEtab: this.idEtab,
        dossierId: this.dossierId,
        idMotif: this.motifId,
        token: this.token
      }
    });

    modal.onDidDismiss().then(data => {
      // if (data) {
      //   console.log("user ::::", data["data"]);
      //   this.motifId = 3;
      // }
      this.reponseAvisCR();
    });

    return await modal.present();
    this.currentModal = modal;
  }

  dismissModal() {
    if (this.currentModal) {
      this.currentModal.dismiss().then(() => {
        this.currentModal = null;
      });
    }
  }

  async listeReponseCR(nbReponse, idEtab) {
    console.log("idEtab ::::", idEtab);
    //   if (nbReponse > 0) {
    console.log("dataModalAvis ::::", this.dataModalAvis);
    let objectAvisEtab = [];
    objectAvisEtab = this.getobjectDossier(idEtab);
    console.log("objectAvisEtab ::::", objectAvisEtab);
    // console.log("laReponse ::::", this.dataModalAvis.laReponse);
    const modal = await this.modalCtrl.create({
      component: AvisMedPage,
      componentProps: {
        dataPatient: this.dataPatient,
        dataModalAvis: objectAvisEtab
      }
    });

    modal.onDidDismiss().then(data => {
      if (data) {
        console.log("user ::::", data["data"]);
        // this.motifId = 3;
      }
      this.reponseAvisCR();
    });

    return await modal.present();
    // } else {
    //   this.sglob.presentToast("Vous n`avez aucune réponse dans cet CR!");
    // }
  }

  getobjectDossier(id: any) {
    // console.log(this.dataModalAvis);
    return this.dataModalAvis.find(dossier => {
      return dossier["idEtab"] === id;
    });
  }

  reponseAvisCR() {
    this.dataModalAvis = [];
    this.loadingCtrl
      .create({ keyboardClose: true, message: "opération  en cours..." })
      .then(loadingEl => {
        loadingEl.present();
        // ---- Call reponseDemandeAvis API
        const authObs: Observable<ReponseAvisResponseData> = this.srvApp.reponseDemandeAvis(
          this.dossierId,
          this.token
        );
        authObs.subscribe(
          // :::::::::::: ON RESULT ::::::::::
          resData => {
            // ----- Hide loader ------
            loadingEl.dismiss();

            if (+resData.code === 200) {
              this.dataReponsesAvis = resData.data;
              if (Object.keys(this.dataReponsesAvis).length > 0) {
                console.log(
                  "this.dataReponsesAvis === ",
                  this.dataReponsesAvis
                );

                this.dataReponsesAvis.forEach(element => {
                  console.log("element ", element.demandeId);

                  console.log("reponses ", element.reponses);
                  const motifId = element.motifId;
                  console.log("motifId ", motifId);

                  if (motifId === this.motifId) {
                    console.log("element222 ", element.demandeId);
                    console.log(
                      "================ length",
                      Object.keys(element.reponses).length
                    );
                    this.dataModalAvis.push({
                      demandeId: element.demandeId,
                      etabName: element.demandeToCr.etabName,
                      idEtab: element.demandeToCr.etabId,
                      nbReponse: Object.keys(element.reponses).length,
                      idDossier: this.dossierId,
                      motifId: element.motifId,
                      idResultat: 6,
                      laReponse: element.reponses
                    });
                  }
                });

                this.afficheReponseMed = 2;
              }

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

  // async showAlertConfirme(diag: string) {
  //   let msgAlert = "";
  //   // ----------- message dynamic ---------------

  //   if (diag === "ST") {
  //     this.stepId = 7;
  //     msgAlert =
  //       "Etes-vous sur qu'il existe un facteur de risque d'infarctus connu au moment de diagnostic?";
  //   } else if (diag === "RAS") {
  //     this.stepId = 10;
  //     msgAlert =
  //       "Etes-vous sur qu'il n'existe aucun facteur de risque d'infarctus connu au moment de diagnostic ? ";
  //   }

  //   console.log("DIAG ::::", msgAlert);
  //   // -----------END  message dynamic ---------------
  //   const alert = await this.alertCtrl.create({
  //     header: "Résultat d'authentication",
  //     message: msgAlert,
  //     cssClass: "alert-css",
  //     buttons: [
  //       {
  //         text: "Annuler",
  //         role: "cancel",
  //         cssClass: "secondary",
  //         handler: () => {
  //           console.log("Confirme Annuler");
  //         }
  //       },
  //       {
  //         text: "Je confirme",
  //         handler: async () => {
  //           if (diag === "RAS") {
  //             await this.router.navigate([
  //               "/ras",
  //               this.dossierId,
  //               JSON.stringify(this.dataPatient)
  //             ]);
  //           } else {
  //             await this.router.navigate([
  //               "/pretreatment",
  //               this.dossierId,
  //               JSON.stringify(this.dataPatient)
  //             ]);
  //           }
  //         }
  //       }
  //     ]
  //   });
  //   await alert.present();
  // }
  // decision() {
  //   console.log("orientation vers datapatient diag ===>", this.dataPatient);
  //   this.router.navigate([
  //     "./diagnostic",
  //     this.dossierId,
  //     JSON.stringify(this.dataPatient)
  //   ]);
  // }

  async goToTrombo() {
    this.dataPatient.resultId = 15;
    this.srvApp.setExtras(this.dataPatient);
    await this.router.navigate(["/treatment-thromb"]);
  }
}
