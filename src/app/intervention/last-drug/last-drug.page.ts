import { Component, OnInit } from "@angular/core";
import { ServiceAppService } from "src/app/services/service-app.service";
import { GlobalvarsService } from "src/app/services/globalvars.service";
import { ActivatedRoute, Router } from "@angular/router";
import {
  LoadingController,
  AlertController,
  ModalController
} from "@ionic/angular";
import { Observable } from "rxjs";
import { ClotureResponseData } from "src/app/models/cloture.response";
import { ClotureModel } from "src/app/models/cloture.model";
import { DossierModel } from "src/app/models/dossier.model";
@Component({
  selector: "app-last-drug",
  templateUrl: "./last-drug.page.html",
  styleUrls: ["./last-drug.page.scss"]
})
export class LastDrugPage implements OnInit {
  idUser: number;
  idEtab: number;
  token: string;
  idDossier: number;
  idCr: number;
  resultatId: number;
  dataPatients: Array<DossierModel>;
  hasHistoric = false;
  dataPatient: object;
  ecgTmp: string;
  isLoading = false;
  isCloture: boolean;
  returnClotureDossier: ClotureModel;

  ecgImage = "/assets/images/ecg.jpg";

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
    this.isCloture = false;

    console.log(" idUser ::: ", this.idUser);

    this.activatedroute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("dataPatientObj")) {
        this.router.navigate(["/home"]);
      } else {
        const dataObj = paramMap.get("dataPatientObj");
        this.dataPatient = JSON.parse(dataObj);
        //this.objectInsc = JSON.parse(dataObj);
        console.log(" DIAGNOSTIC >>>>> dataPatients ::: ", this.dataPatient);
        console.log(
          " DIAGNOSTIC >>>>> dataPatients ::: ",
          this.dataPatient["lastName"]
        );
      }
      if (!paramMap.has("idDossier")) {
        this.router.navigate(["/home"]);
      } else {
        this.idDossier = +paramMap.get("idDossier");
        console.log(" DIAGNOSTIC >>>>> idDossier  halim ::: ", this.idDossier);
        this.ecgTmp = this.dataPatient["ecgTmp"];
      }
      if (!paramMap.has("idDossier")) {
        this.router.navigate(["/home"]);
      } else {
        this.idDossier = +paramMap.get("idDossier");
        console.log(" DIAGNOSTIC >>>>> idDossier  halim ::: ", this.idDossier);
        this.ecgTmp = this.dataPatient["ecgTmp"];
      }
      if (!paramMap.has("idCr")) {
        this.router.navigate(["/home"]);
      } else {
        this.idCr = +paramMap.get("idCr");
        console.log(" DIAGNOSTIC >>>>> idCr  ::: ", this.idCr);
      }
      if (!paramMap.has("resultatId")) {
        this.router.navigate(["/home"]);
      } else {
        this.resultatId = +paramMap.get("resultatId");
        console.log(" DIAGNOSTIC >>>>> resultatId  ::: ", this.resultatId);
      }
      // resultatId;
    });

    console.log(" ras >>>>> dataPatient ::: ", this.dataPatient);
    console.log(" ras idDosier   ::: ", this.idDossier);
  }

  clotureDossier() {
    this.isLoading = true;

    this.loadingCtrl
      .create({ keyboardClose: true, message: "Clôture en cours..." })
      .then(loadingEl => {
        loadingEl.present();
        const params = {
          dossierId: this.idDossier,
          resultatId: this.resultatId,
          plavix: 1,
          crId: this.idCr,
          angio: 1,
          doctorId: this.idUser
        };

        console.log(" params ", params);
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
              this.sglob.updateInitFetchHome(true);
              console.log(" diag getInitFetch ", this.sglob.getInitFetch());
              this.router.navigate(["/home"]);

              //this.isCloture = true;
            } else {
              // ----- Hide loader ------
              loadingEl.dismiss();
              this.showAlert("Problème interne !!!");
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
                "Problème d'accès au réseau, veillez vérifier votre connexion"
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
