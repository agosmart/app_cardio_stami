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
  etatDossier: number;
  isExistDossier: boolean;
  isLoading = false;
  objectPatient: Array<DossierModel>;
  dataPatient: object;
  dataPatientObj: object;

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
    return [
      {
        ...this.objectPatient.find(dossier => {
          return dossier["id_dossier"] === id;
        })
      }
    ];
  }

  goToDiag(idDossier) {
    console.log("idDossier==>", idDossier);
    this.dataPatient = this.getDataPatient(idDossier);
    console.log("dataPatient===>", this.dataPatient);
    // this.dataPatientObj = [
    //   {
    //     firstName: this.dataPatient["prenom_patient"],
    //     lastName: this.dataPatient["nom_patient"],
    //     birthday: this.dataPatient["naissance_patient"],
    //     idPatient: this.dataPatient["id_patient"],
    //     idMed: this.dataPatient["id_medecin"],
    //     weight: this.dataPatient["poids"],
    //     imgEcg: this.dataPatient["ecg"],
    //     id_dossier: this.dataPatient["id_dossier"],
    //     dThorasic: this.dataPatient["douleur_thoracique"],
    //     startTime: this.dataPatient["start_at"]
    //   }
    // ];
    // console.log("dataPatientObj===>", this.dataPatientObj);
    this.router.navigate([
      "./diagnostic",
      idDossier,
      JSON.stringify(this.dataPatient)
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
