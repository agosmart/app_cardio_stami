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
  idUser: number;
  idEtab: number;
  token: string;
  pageStape: string;
  etatDossier: number;
  isExistDossier: boolean;
  isLoading = false;
  objectPatient: Array<DossierModel>;
  dataPatient: DossierModel;
  dataPatientObj: object;

  constructor(
    private srv: ServiceAppService,
    private sglob: GlobalvarsService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router
  ) {
    this.isExistDossier = false;
    this.idUser = this.sglob.getIdUser();
    this.token = this.sglob.getToken();
    this.idEtab = this.sglob.getidEtab();
    //console.log("idEtab", this.idEtab);
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
              this.objectPatient = resData.data;
              //const dataResponse: DossierResponseData = resData;
              //  console.log("dataResponse", this.objectPatient.length);
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

  getDataPatient(id: any) {
    console.log(this.objectPatient);
    return this.objectPatient.find(dossier => {
      return dossier["dossierId"] === id;
    });
  }
  goToDiag(idDossier) {
    this.dataPatient = this.getDataPatient(idDossier);
    console.log(" vers diag dataPatient===>", this.dataPatient);
    this.router.navigate([
      "./diagnostic",
      idDossier,
      JSON.stringify([this.dataPatient])
    ]);
  }

  goToStape(idDossier) {
    this.dataPatient = this.getDataPatient(idDossier);
    console.log(" vers diag stape===>", this.dataPatient);
    this.pageStape = this.dataPatient["page"];
    this.router.navigate([
      "./" + this.pageStape,
      idDossier,
      JSON.stringify([this.dataPatient])
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
