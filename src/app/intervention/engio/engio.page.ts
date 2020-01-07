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
import { DossierResponseData } from "src/app/models/dossier.response";
import { DossierModel } from "src/app/models/dossier.model";

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
  resultName: string;
  idCr = 0;
  stepId = 0;
  isLoading = false;
  resultatId: number;
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
        this.resultName = this.dataPatient["resultName"];
        console.log(" gocr  >>>>> dataPatients ::: ", this.dataPatient);
        console.log("resultName", this.resultName);
        if (this.dataPatient["stepId"] !== 15) {
          this.srvApp.stepUpdatePage(this.dossierId, 15, 14, this.token);
        }

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
    this.dataPatient.resultId = 7; //  300 plavix
    this.dataPatient.idCr = this.idCr; //  id cr choisit
    this.dataPatient.stepId = 15;
    await this.router.navigate([
      "/last-drug",
      this.dossierId,
      JSON.stringify(this.dataPatient)
    ]);
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
    this.dataPatient.resultId = 13;
    await this.router.navigate([
      "/thromb-absolut",
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
