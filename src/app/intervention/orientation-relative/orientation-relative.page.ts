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
  selector: "app-orientation-relative",
  templateUrl: "./orientation-relative.page.html",
  styleUrls: ["./orientation-relative.page.scss"]
})
export class OrientationRelativePage implements OnInit {
  idUser: number;
  idEtab: number;
  dossierId: number;
  lastMotifId: number;
  stepId: number;
  token: string;
  etabName: string;
  itemsCR: any;
  idCr: number;
  lastCrName: string;
  reviewsList = 0;
  nbRep: number;
  urlEcg: string;
  itemsMeds: ListeMedByCRModel;
  dataReponsesAvis: Array<ReponseAvisModel>;
  dataModalAvis = [];

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

  ngOnInit() {
    this.sglob.updateInitFetchHome(true);
    this.idUser = this.sglob.getIdUser();
    this.idEtab = this.sglob.getidEtab();
    this.token = this.sglob.getToken();
    this.activatedroute.paramMap.subscribe(paramMap => {
      console.log(
        "*************dataPatientObj :",
        paramMap.get("dataPatientObj")
      );
      if (!paramMap.has("dataPatientObj")) {
        this.router.navigate(["/home"]);
      } else {
        const dataObj = paramMap.get("dataPatientObj");
        this.dataPatient = JSON.parse(dataObj);
        this.dossierId = this.dataPatient.dossierId;
        this.urlEcg = this.dataPatient["ecgImage"];
        this.demandeAvisId = this.dataPatient.LastDemandeAvisId;
        this.lastMotifId = this.dataPatient.lastMotifId;
        this.idCr = this.dataPatient.lastCrId;
        console.log("*************dataPatient :", this.dataPatient);
        const motifId = this.dataPatient.lastMotifId;

        if (this.dataPatient.stepId !== 26) {
          this.srvApp.stepUpdatePage(this.dossierId, 26, 9, this.token);
        }
        if (this.demandeAvisId > 0 && this.lastMotifId === 2) {
          this.afficheReponseMed = 1;
          this.reviewsDecision = true;
          this.lastCrName = this.dataPatient["lastCrName"];
          this.reponseAvisCR();
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

  async afficherListeCrModal() {
    console.log("image ::::", this.urlEcg);
    const modal = await this.modalCtrl.create({
      component: ListCrPage,
      componentProps: {
        idUser: this.idUser,
        idEtab: this.idEtab,
        idMotif: 2,
        dossierId: this.dossierId,
        token: this.token
      }
    });

    modal.onDidDismiss().then(data => {
      console.log("data ::::", data["data"]);
      if (data["data"] > 0) {
        this.reponseAvisCR();
      }
    });
    return await modal.present();
  }

  async listeReponseCR(nbReponse, idEtab) {
    console.log("idEtab ::::", idEtab);
    if (nbReponse > 0) {
      console.log("dataModalAvis ::::", this.dataModalAvis);
      let objectAvisEtab = [];
      objectAvisEtab = this.getobjectDossier(idEtab);
      console.log("objectAvisEtab ::::", objectAvisEtab);
      const modal = await this.modalCtrl.create({
        component: AvisMedPage,
        componentProps: {
          dataPatient: this.dataPatient,
          dataModalAvis: objectAvisEtab
        }
      });
      return await modal.present();
    } else {
      this.sglob.presentToast("Vous n`avez aucune réponse dans cet CR!");
    }

    // const modal = await modalController.create({ component: UploadPage });
    // const { data } = await modal.onDidDismiss();
    // if (data) {
    //   console.log("::::::onDidDismiss ::::");
    // }
  }

  getobjectDossier(id: any) {
    //console.log(this.dataModalAvis);
    return this.dataModalAvis.find(dossier => {
      return dossier["idEtab"] === id;
    });
  }

  reponseAvisCR() {
    this.dataModalAvis = [];
    this.afficheReponseMed = 1;
    this.nbRep = 0;
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
                this.dataReponsesAvis.forEach(element => {
                  const motifId = element.motifId;
                  if (motifId === 2) {
                    this.nbRep =
                      this.nbRep + Object.keys(element.reponses).length;
                    this.dataModalAvis.push({
                      demandeId: element.demandeId,
                      etabName: element.demandeToCr.etabName,
                      idEtab: element.demandeToCr.etabId,
                      nbReponse: Object.keys(element.reponses).length,
                      idDossier: this.dossierId,
                      motifId: element.motifId,
                      idResultat: this.dataPatient.resultId,
                      laReponse: element.reponses
                    });
                  }
                });
                this.afficheReponseMed = 2;

                console.log("afficheReponseMed", this.afficheReponseMed);
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

  async goToTrombo() {
    this.dataPatient.resultId = 13;
    await this.router.navigate([
      "/treatment-thromb",
      this.dossierId,
      JSON.stringify(this.dataPatient)
    ]);
  }
}
