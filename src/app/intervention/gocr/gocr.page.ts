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
import { EtabResponseData } from "src/app/models/etab.response";
import { ClotureResponseData } from "src/app/models/cloture.response";

//# moment to calculate time deffirence
import * as moment from "moment";
import { DossierResponseData } from "src/app/models/dossier.response";
import { UserModel } from "src/app/models/user.model";
import { DossierModel } from "src/app/models/dossier.model";

@Component({
  selector: "app-gocr",
  templateUrl: "./gocr.page.html",
  styleUrls: ["./gocr.page.scss"]
})
export class GocrPage implements OnInit {
  idUser: number;
  idEtab: number;
  dossierId: number;
  token: string;
  resultName: "";
  idCr = 0;
  stepId = 13;
  resultId: number;
  isLoading = false;
  dataPatient: DossierModel;
  retunListeCR: EtabResponseData;
  itemsCR: any;
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
        //this.resultId = this.dataPatient["resultId"];

        this.resultId = this.dataPatient["resultId"];
        // this.resultName = this.dataPatient["resultName"];
        console.log(" resultId ::: ", this.resultId);
        if (this.dataPatient["stepId"] !== 13) {
          this.srvApp.stepUpdatePage(
            this.dossierId,
            13,
            this.resultId,
            this.token
          );
        }
        this.listeCr();
        console.log(" gocr  >>>>> dataPatients ::: ", this.dataPatient);
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
        // ---------- DEMO DURATION ----------
        this.itemsCR[0]["duration"] = "00:25:00";
        this.itemsCR[1]["duration"] = "03:25:00";
        //--------------------------------------
        console.log("nom etab cr", this.retunListeCR.data);
      } else {
        console.log("no");
      }
    });
  }

  choixCr(idCr) {
    console.log("idrc ====> ", idCr);
    this.idCr = idCr;
  }

  envoiCR() {
    console.log("envoiCR  ====> ", this.idCr);
    console.log("envoi vers cr idrc ", this.idCr);
    if (this.resultId === 8 || this.resultId === 9) {
      this.dataPatient.stepId = 13;

      this.dataPatient.resultId = this.resultId;
      this.router.navigate([
        "/last-drug",
        this.dossierId,
        JSON.stringify(this.dataPatient)
      ]);
    } else {
      this.isLoading = true;
      this.loadingCtrl
        .create({ keyboardClose: true, message: "opération  en cours..." })
        .then(loadingEl => {
          loadingEl.present();

          const params = {
            dossierId: this.dossierId,
            resultatId: this.resultId,
            crId: this.idCr,
            doctorId: this.dataPatient["doctorId"]
          };

          const authObs: Observable<ClotureResponseData> = this.srvApp.clotureDossier(
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
                console.log(" resData", resData);
                //this.sglob.presentToast(resData.message);
                // ----- Redirection to Home page ------------
                this.sglob.updateInitFetchHome(true);
                this.router.navigate(["/home"]);
              } else {
                // --------- Show Alert --------
                this.sglob.showAlert("Erreur", resData.message);
              }
            },

            // ::::::::::::  ON ERROR ::::::::::::
            errRes => {
              console.log(errRes);
              // ----- Hide loader ------
              loadingEl.dismiss();
              // --------- Show Alert --------
              if (errRes.error.errors != null) {
                this.sglob.showAlert("Erreur", errRes.error.errors.email);
              } else {
                this.sglob.showAlert(
                  "Erreur",
                  "Prblème d'accès au réseau, veillez vérifier votre connexion"
                );
              }
            }
          );
        });
    }
  }

  async showAlertConfirme() {
    if (this.idCr > 0) {
      let msgAlert = "";
      // ----------- message dynamic ---------------
      msgAlert =
        "Etes-vous sur de vouloire cloturer le dossier et envoyer le patient au CR ? ";
      this.stepId = 11;

      console.log("DIAG ::::", msgAlert);
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
              this.envoiCR();
            }
          }
        ]
      });
      await alert.present();
    } else {
      this.sglob.showAlert("Attention ", "Veuillez choisir un CR!");
    }
  }

  getHoursFromTime(duration: string) {
    const time = moment(duration, "HH:mm:ss");
    const hours = time.get("hours");
    return hours;
  }

  calculateTimeMoment___() {
    const x = moment("00:32:30", "HH:mm:ss");
    const y = moment("02:00:00", "HH:mm:ss");
    const duration = moment.duration(x.diff(y));
    console.log(duration.get("hours"));
    const z = moment("07:02:30", "HH:mm:ss");
    console.log(z.get("hours"));
  }
}
