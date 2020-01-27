import { Component, OnInit } from "@angular/core";
import { ServiceAppService } from "../services/service-app.service";
import { GlobalvarsService } from "../services/globalvars.service";
import { Router } from "@angular/router";
import { PatientModel } from "../models/patient.model";
import { DossierResponseData } from "../models/dossier.response";
import { LoadingController, AlertController, Platform } from "@ionic/angular";
import { Observable } from "rxjs";
import { DossierModel } from "../models/dossier.model";
import { FCM } from "@ionic-native/fcm/ngx";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage implements OnInit {
  IdUser: number;
  idEtab: number;
  token: string;
  pageStep: string;
  etatDossier: number;
  isExistDossier = false;
  isLoading = false;
  objectDossiers: Array<DossierModel>;
  objectDossier: DossierModel;
  constructor(
    private srv: ServiceAppService,
    private sglob: GlobalvarsService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
    private platform: Platform,
    private fcm: FCM
  ) {
    this.isExistDossier = false;
    this.IdUser = this.sglob.getIdUser();
    this.token = this.sglob.getToken();
    this.idEtab = this.sglob.getidEtab();
    //console.log("idEtab", this.idEtab);

    this.platform.ready().then(() => {
      this.fcm.onNotification().subscribe(data => {
        if (data.wasTapped) {
          //Notification was received on device tray and tapped by the user.
          console.log("ok", JSON.stringify(data));
          console.log("Nothing idDossier", JSON.stringify(data.idDossier));
          console.log("Nothing page", JSON.stringify(data.etabName));
          // this.router.navigate(["/" + data.page]);
          this.onNotifReceived(data);
        } else {
          //Notification was received in foreground. Maybe the user needs to be notified.
          console.log("Nothing data", JSON.stringify(data));
          console.log("Nothing idDossier", JSON.stringify(data.idDossier));
          console.log("Nothing page", JSON.stringify(data.etabName));
          //this.router.navigate(["/" + data.page]);
          this.onNotifReceived(data);
        }
      });
    });
  }

  ionViewDidEnter() {
    console.log(" home ionViewDidEnter before", this.sglob.getInitFetch());
    if (this.sglob.getInitFetch()) {
      this.objectDossiers = [];
      this.isExistDossier = false;
      this.listingDossier();
      this.sglob.updateInitFetchHome(false);
      console.log(" home ionViewDidEnter after", this.sglob.getInitFetch());
    }
  }
  ngOnInit() {
    this.etatDossier = 0; // dossiers ouverts
    this.listingDossier();
  }

  async onNotifReceived(data) {
    console.log("onNotifReceived data ==>", data);
    console.log("onNotifReceived etabname  ==>", JSON.stringify(data.etabName));
    const etabName = JSON.stringify(data.etabName);
    // console.log("onNotifReceived etab name point ==>", data.etabName);
    // -----------END  message dynamic ---------------
    const alert = await this.alertCtrl.create({
      header: "Résultat d'authentication",
      message:
        "vos avez reçu une réponse d`avis medicale provenant du centre CR" +
        etabName,
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
          text: "Je consulte",
          handler: async () => {
            this.goToNotif(1, 2);
            // this.router.navigate([
            //   "/dossier-infos",
            //   JSON.stringify(data.idDossier)
            // ]);
          }
        }
      ]
    });
    await alert.present();
  }

  goToNotif(dossierId, motifId) {
    let pageToLoad;

    switch (motifId) {
      case 1:
        pageToLoad = "orientation";
        break;
      case 2:
        pageToLoad = "thromb-sos";
        break;
      default:
        pageToLoad = "envoi-cr";
    }

    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: "opération en cours..." })
      .then(loadingEl => {
        loadingEl.present();

        const params = this.etatDossier;

        //   console.log("params======>", params);
        const authObs: Observable<DossierResponseData> = this.srv.showDossier(
          this.token,
          dossierId
        );
        // ---- Call Login function
        authObs.subscribe(
          // :::::::::::: ON RESULT ::::::::::
          resData => {
            this.isLoading = false;
            console.log("<<<<<<<<<<<<<<<<<<<<<<Response >>>>> ", resData);
            // ----- Hide loader ------
            loadingEl.dismiss();
            if (resData.data.length > 0) {
              console.log("resData", resData);
              this.objectDossiers = resData.data;
              this.router.navigate([
                "/" + pageToLoad,
                dossierId,
                JSON.stringify(this.objectDossiers)
              ]);
            } else {
              // --------- Show Alert --------
              // this.showAlert(resData.message);
            }
          },

          // ::::::::::::  ON ERROR ::::::::::::
          errRes => {
            //console.log(errRes);
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
  regrechListDossier() {
    this.objectDossiers = [];
    this.listingDossier();
  }

  goToAddDossier() {
    // console.log("go to add");
    this.router.navigate(["inscription"]);
  }

  // ------ Api service login ---------------
  listingDossier() {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: "Recherche en cours..." })
      .then(loadingEl => {
        loadingEl.present();

        const params = this.etatDossier;

        //   console.log("params======>", params);
        const authObs: Observable<DossierResponseData> = this.srv.listingDossier(
          params,
          this.token,
          this.idEtab
        );
        // ---- Call Login function
        authObs.subscribe(
          // :::::::::::: ON RESULT ::::::::::
          resData => {
            this.isLoading = false;
            // const dataResponse: UserModel = JSON.stringify(resData.data);

            console.log("<<<<<<<<<<<<<<<<<<<<<<Response >>>>> ", resData);

            // ----- Hide loader ------
            loadingEl.dismiss();
            if (resData.data.length > 0) {
              //console.log("resData", resData);
              this.isExistDossier = true;
              this.objectDossiers = resData.data;
              //  this.objectDossiers['diagnostique'];
              //const dataResponse: DossierResponseData = resData;
              //  console.log("dataResponse", this.objectDossiers.length);
            } else {
              // --------- Show Alert --------
              // this.showAlert(resData.message);
            }
          },

          // ::::::::::::  ON ERROR ::::::::::::
          errRes => {
            //console.log(errRes);
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

  getobjectDossier(id: any) {
    console.log(this.objectDossiers);
    return this.objectDossiers.find(dossier => {
      return dossier["dossierId"] === id;
    });
  }

  goToStep(idDossier) {
    this.objectDossier = this.getobjectDossier(idDossier);
    this.pageStep = this.objectDossier["page"];

    // this.objectDossier.ecgData[1]["dossierId"] = 300;
    // this.objectDossier.ecgData[1]["ecgImage"] = "a.jpg";
    // this.objectDossier.ecgData[1]["etape"] = "Thrombolyse";
    // this.objectDossier.ecgData[1]["createdAt"] = "datecrea";

    console.log(" addd ecg===>", this.pageStep, " / ", this.objectDossier);
    //this.objectDossier.resultatId = 66;
    // this.objectDossier.stepId = 12;
    this.router.navigate([
      "/" + this.pageStep,
      idDossier,
      JSON.stringify(this.objectDossier)
    ]);
    // this.router.navigate([
    //   "./" + this.pageStep, JSON.stringify([this.objectDossier])
    // ]);
  }
}
