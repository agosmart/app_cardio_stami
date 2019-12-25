import { Component, OnInit } from "@angular/core";
import { ServiceAppService } from "../services/service-app.service";
import { GlobalvarsService } from "../services/globalvars.service";
import { Router } from "@angular/router";
import { PatientModel } from "../models/patient.model";
import { DossierResponseData } from "../models/dossier.response";
import { LoadingController, AlertController } from "@ionic/angular";
import { Observable } from "rxjs";
import { DossierModel } from "../models/dossier.model";

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
  isExistDossier: boolean;
  isLoading = false;
  objectDossiers: Array<DossierModel>;
  objectDossier: DossierModel;
  // objectDossierObj: object;

  constructor(
    private srv: ServiceAppService,
    private sglob: GlobalvarsService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router
  ) {
    this.isExistDossier = false;
    this.IdUser = this.sglob.getIdUser();
    this.token = this.sglob.getToken();
    this.idEtab = this.sglob.getidEtab();
    //console.log("idEtab", this.idEtab);
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
    this.etatDossier = 0; // dossier ouvert
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
      .create({ keyboardClose: true, message: "recherche dossier en cours..." })
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
              //this.[0].diagnostic['diagnostique']:
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

  getobjectDossier(id: any) {
    console.log(this.objectDossiers);
    return this.objectDossiers.find(dossier => {
      return dossier["dossierId"] === id;
    });
  }

  goToStep(idDossier) {
    this.objectDossier = this.getobjectDossier(idDossier);
    this.pageStep = this.objectDossier["page"];

    console.log(
      " vers diag stape===>",
      this.pageStep,
      " / ",
      this.objectDossier
    );

    this.router.navigate([
      "./" + this.pageStep,      
      JSON.stringify([this.objectDossier])
    ]);
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