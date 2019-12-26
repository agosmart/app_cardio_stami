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

@Component({
  selector: "app-engio",
  templateUrl: "./engio.page.html",
  styleUrls: ["./engio.page.scss"]
})
export class EngioPage implements OnInit {
  idUser: number;
  idEtab: number;
  dossierId: number;
  token: string;
  idCr = 0;
  stepId = 0;
  isLoading = false;
  dataPatient: object;
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
        console.log(" gocr  >>>>> dataPatients ::: ", this.dataPatient);
        this.listeCr();
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
      } else {
        console.log("no");
      }
    });
  }

  choixCr(idCr) {
    console.log("idrc ====> ", idCr);
    this.idCr = idCr;
  }

  async envoiCR() {
    console.log("envoiCR  ====> ", this.idCr);
    console.log("envoi vers cr idrc ", this.idCr);
    await this.router.navigate([
      "/last-drug",
      this.dossierId,
      JSON.stringify(this.dataPatient)
    ]);
    // this.isLoading = true;
    // this.loadingCtrl
    //   .create({ keyboardClose: true, message: "opération  en cours..." })
    //   .then(loadingEl => {
    //     loadingEl.present();

    //     const params = {
    //       dossierId: this.dossierId,
    //       resultatId: 6,
    //       crId: this.idCr,
    //       doctorId: this.dataPatient["doctorId"]
    //     };

    //     const authObs: Observable<ClotureResponseData> = this.srvApp.clotureDossier(
    //       params,
    //       this.token
    //     );
    //     // ---- Call Login function
    //     authObs.subscribe(
    //       // :::::::::::: ON RESULT ::::::::::
    //       resData => {
    //         this.isLoading = false;
    //         // ----- Hide loader ------
    //         loadingEl.dismiss();

    //         if (+resData.code === 201) {
    //           console.log(" resData", resData);
    //           //this.sglob.presentToast(resData.message);
    //           // ----- Redirection to Home page ------------
    //           this.sglob.updateInitFetchHome(true);
    //           this.router.navigate(["/home"]);
    //         } else {
    //           // --------- Show Alert --------
    //           this.sglob.showAlert("Erreur", resData.message);
    //         }
    //       },

    //       // ::::::::::::  ON ERROR ::::::::::::
    //       errRes => {
    //         console.log(errRes);
    //         // ----- Hide loader ------
    //         loadingEl.dismiss();
    //         // --------- Show Alert --------
    //         if (errRes.error.errors != null) {
    //           this.sglob.showAlert("Erreur", errRes.error.errors.email);
    //         } else {
    //           this.sglob.showAlert(
    //             "Erreur",
    //             "Prblème d'accès au réseau, veillez vérifier votre connexion"
    //           );
    //         }
    //       }
    //     );
    //   });
  }

  async showAlertConfirme() {
    if (this.idCr > 0) {
      let msgAlert = "";
      // ----------- message dynamic ---------------
      msgAlert =
        "Etes-vous sur de vouloire cloturer le dossier et envoyer le patient au CR ? ";
      this.stepId = 11;

      console.log("msgAlert ::::", msgAlert);
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

  async goToTromb() {
    await this.router.navigate([
      "/thromb",
      this.dossierId,
      JSON.stringify(this.dataPatient)
    ]);
  }

  private showAlert(messageAlert: string) {
    this.alertCtrl
      .create({
        header: "Résultat validation choix",
        message: messageAlert,
        cssClass: "alert-css",
        buttons: ["Ok"]
      })
      .then(alertEl => alertEl.present());
  }
}
