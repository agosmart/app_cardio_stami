import { Component, OnInit } from "@angular/core";
import { ServiceAppService } from "src/app/services/service-app.service";
import { GlobalvarsService } from "src/app/services/globalvars.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DossierModel } from "src/app/models/dossier.model";
import { LoadingController, AlertController } from "@ionic/angular";
import { Observable } from "rxjs";
import { ClotureResponseData } from "src/app/models/cloture.response";
import { ClotureModel } from "src/app/models/cloture.model";

@Component({
  selector: "app-ras",
  templateUrl: "./ras.page.html",
  styleUrls: ["./ras.page.scss"]
})
export class RasPage implements OnInit {
  idUser: number;
  idEtab: number;
  token: string;
  idDossier: number;
  dataPatients: Array<DossierModel>;
  hasHistoric = false;
  dataPatient: object;
  ecgTmp: string;
  isLoading = false;
  isCloture: boolean;
  returnClotureDossier: ClotureModel;

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
    this.isCloture = false;
    // this.activatedroute.paramMap.subscribe(paramMap => {
    //   if (!paramMap.has("dataPatientObj")) {
    //     this.router.navigate(["/home"]);
    //   } else {
    //     const dataObj = paramMap.get("dataPatientObj");
    //     this.dataPatient = JSON.parse(dataObj);
    //     //this.objectInsc = JSON.parse(dataObj);
    //     console.log(" DIAGNOSTIC >>>>> dataPatients ::: ", this.dataPatient);
    //     console.log(
    //       " DIAGNOSTIC >>>>> dataPatients ::: ",
    //       this.dataPatient["lastName"]
    //     );
    //   }
    //   if (!paramMap.has("idDossier")) {
    //     this.router.navigate(["/home"]);
    //   } else {
    //     this.idDossier = +paramMap.get("idDossier");
    //     console.log(" DIAGNOSTIC >>>>> idDossier  halim ::: ", this.idDossier);
    //     this.ecgTmp = this.dataPatient["ecgTmp"];
    //   }
    // });

    this.idDossier = 1;

    this.dataPatient = {
      firstName: "Bouaziz",
      lastName: "Halim",
      birthDay: "2019-11-01",
      gender: "2",
      dossierId: 110,
      weight: 14,
      doctorId: 61,
      dThorasic: true,
      etabId: 5,
      ecgImage: "file:/",
      ecgAfficher: "http:/",
      startAt: "13:25:00"
    };
    console.log(" ras >>>>> dataPatient ::: ", this.dataPatient);
    console.log(" ras idDosier   ::: ", this.idDossier);
  }

  clotureDossier() {
    this.isLoading = true;
    this.isCloture = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: "cloture  en cours..." })
      .then(loadingEl => {
        loadingEl.present();

        const params = {
          dossierId: this.idDossier,
          resultatId: 1,
          doctorId: this.dataPatient["doctorId"]
        };

        const authObs: Observable<ClotureResponseData> = this.srvApp.clotureDossier(
          params,
          this.token
        );
        authObs.subscribe(
          resData => {
            this.isLoading = false;
            this.returnClotureDossier = resData.data;
            loadingEl.dismiss();
            if (+resData.code === 201) {
              this.isCloture = true;
            } else {
              // ----- Hide loader ------
              loadingEl.dismiss();
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
