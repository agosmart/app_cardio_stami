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
  itemsCR: any;
  itemsMeds: ListeMedByCRModel;
  dataReponsesAvis: ReponseAvisModel;
  isLoading = false;
  afficheListeCr = false;
  afficheReponseMed = false;
  demandeAvisId = 0;
  etabName = "abc";
  dataPatient: DossierModel;
  retunListeCR: EtabResponseData;

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
    this.idUser = this.sglob.getIdUser();
    this.idEtab = this.sglob.getidEtab();
    this.token = this.sglob.getToken();
    this.activatedroute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("dataPatientObj")) {
        this.router.navigate(["/home"]);
      } else {
        const dataObj = paramMap.get("dataPatientObj");
        this.dataPatient = JSON.parse(dataObj);
        this.dossierId = this.dataPatient["dossierId"];
        this.demandeAvisId = this.dataPatient["LastDemandeAvisId"];
        const motifId = this.dataPatient["lastMotifId"];
        if (this.dataPatient["stepId"] !== 19) {
          this.srvApp.stepUpdatePage(this.dossierId, 19, 9, this.token);
        }
        console.log("demandeAvisId", this.demandeAvisId);
        if (this.demandeAvisId > 0 && motifId === 2) {
          this.afficheListeCr = true;
          this.reponseAvisCR(this.demandeAvisId);
        } else {
          this.listeCr();
        }
      }
      // 1 c les CR  2 CUDT
    });
  }

  listeCr() {
    this.srvApp.getListeCR(1).subscribe((resp: any) => {
      this.retunListeCR = resp;
      console.log("return liste cr", this.retunListeCR);
      console.log("return liste code", this.retunListeCR.code);
      // this.retunListeCR.code = 200; // a enlever
      if (+this.retunListeCR.code === 200) {
        this.itemsCR = this.retunListeCR.data;
        console.log("nom etab cr", this.retunListeCR.data);

        // ---------- DEMO DURATION ----------
        this.itemsCR[0]["duration"] = "00:25:00";
        this.itemsCR[1]["duration"] = "03:25:00";
        //--------------------------------------
      } else {
        console.log("no");
      }
    });
  }

  demandeAvisCr(idCr) {
    console.log("demandeAvisCr idrc ", idCr);
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: "opération  en cours..." })
      .then(loadingEl => {
        loadingEl.present();

        const params = {
          doctorId: this.idUser,
          cudtId: this.idEtab,
          crId: idCr,
          dossierId: this.dossierId,
          motifId: "2"
        };

        const authObs: Observable<DemandeAvisResponseData> = this.srvApp.demandeAvis(
          params,
          this.token
        );
        // ---- Call Login function
        authObs.subscribe(
          // :::::::::::: ON RESULT ::::::::::
          resData => {
            this.isLoading = false;
            // ----- Hide loader ------
            loadingEl.dismiss();

            if (+resData.code === 201) {
              // this.etabName = this.itemsMeds[0]["etabName"];
              this.afficheListeCr = true;
              console.log(" resData", resData.data);
              console.log(" resData demandeId", resData.data.demandeId);
              this.demandeAvisId = resData.data.demandeId;
              this.reponseAvisCR(this.demandeAvisId);
              //this.sglob.presentToast(resData.message);
              // ----- Redirection to Home page ------------
            } else {
              // --------- Show Alert --------
              this.showAlert(resData.message);
            }
          },

          // ::::::::::::  ON ERROR ::::::::::::
          errRes => {
            console.log(errRes);
            // ----- Hide loader ------
            loadingEl.dismiss();
            // --------- Show Alert --------
            if (errRes.error.errors != null) {
              this.showAlert(errRes.error.errors.email);
            } else {
              this.showAlert(
                "Prblème d'accès au réseau, veillez vérifier votre connexion"
              );
            }
          }
        );
      });
  }

  reponseAvisCR(demandeAvisId) {
    this.afficheReponseMed = false;
    console.log("******************reponseAvis cr **", demandeAvisId);
    this.isLoading = true;
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
            this.isLoading = false;
            // const dataResponse: UserModel = JSON.stringify(resData.data);
            // ----- Hide loader ------
            loadingEl.dismiss();

            if (+resData.code === 200) {
              // ----- Toast ------------
              console.log("Response >>>>> ", this.dataReponsesAvis);
              this.dataReponsesAvis = resData.data;
              if (Object.keys(this.dataReponsesAvis).length > 0) {
                console.log(
                  "taille data >>>>> ",
                  Object.keys(this.dataReponsesAvis).length
                );
                this.afficheReponseMed = true;
              }
              //this.etabName = this.itemsMeds[0]["etabName"];

              //this.sglob.presentToast(resData.message);
              // ----- Redirection to Home page ------------
            } else {
              // --------- Show Alert --------
              this.showAlert(resData.message);
            }
          },

          // ::::::::::::  ON ERROR ::::::::::::
          errRes => {
            console.log(errRes);
            // ----- Hide loader ------
            loadingEl.dismiss();
            // --------- Show Alert --------
            if (errRes.error.errors != null) {
              this.showAlert(errRes.error.errors.email);
            } else {
              this.showAlert(
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

    console.log("decision ::::", msgAlert);
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
            if (decision === "CR") {
              this.dataPatient.resultId = 9;
              // ************ REDIRECTION TO GOCR PAGE ****************
              this.router.navigate([
                "/gocr",
                this.dossierId,
                JSON.stringify(this.dataPatient)
              ]);
            } else {
              this.router.navigate([
                "/thromb-relative",
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

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: "Résultat d'authentication",
        message: message,
        cssClass: "alert-css",
        buttons: ["Okay"]
      })
      .then(alertEl => alertEl.present());
  }
}
