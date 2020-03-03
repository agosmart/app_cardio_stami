import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  LoadingController,
  AlertController,
  ModalController,
  NavParams
} from "@ionic/angular";
import { DossierModel } from "src/app/models/dossier.model";

@Component({
  selector: "app-avis-med",
  templateUrl: "./avis-med.page.html",
  styleUrls: ["./avis-med.page.scss"]
})
export class AvisMedPage implements OnInit {
  crName: string;
  motifId: number;
  dataModalAvis: [];
  dataReponsesAvis: [];
  dataPatient: DossierModel;
  haseResponse = true;
  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.dataModalAvis = this.navParams.data.dataModalAvis;
    this.dataPatient = this.navParams.data.dataPatient;
    console.log("dataPatient===>", this.dataPatient);
    console.log("dataModalAvis===>", this.dataModalAvis);
    this.dataReponsesAvis = this.dataModalAvis["laReponse"];
    this.crName = this.dataModalAvis["etabName"];
    this.motifId = this.dataModalAvis["motifId"];
    console.log("dataReponsesAvis===>", this.dataReponsesAvis);

    console.log(this.dataReponsesAvis.length);
    if (this.dataReponsesAvis.length === 0) {
      this.haseResponse = false;
    }
  }

  treatmentEngio() {
    console.log("dataPatient", this.dataPatient);
    this.router.navigate([
      "/treatment-engio",
      this.dataModalAvis["idDossier"],
      JSON.stringify(this.dataPatient),
      JSON.stringify(this.dataModalAvis)
    ]);

    this.modalCtrl.dismiss(true);
  }

  closeModal() {
    this.modalCtrl.dismiss(true);
  }

  cloture() {
    this.dataPatient["lastCrId"] = this.dataModalAvis["idEtab"];
    this.router.navigate([
      "/st",
      this.dataModalAvis["idDossier"],
      JSON.stringify(this.dataPatient)
    ]);
    this.modalCtrl.dismiss(true);
  }

  async showAlertConfirme(diag: string) {
    let msgAlert = "";
    // ----------- message dynamic ---------------

    if (diag === "ST") {
      //this.stepId = 7;
      msgAlert =
        "Etes-vous sur qu'il existe un facteur de risque d'infarctus connu au moment de diagnostic?";
    } else if (diag === "RAS") {
      // this.stepId = 10;
      msgAlert =
        "Etes-vous sur qu'il n'existe aucun facteur de risque d'infarctus connu au moment de diagnostic ? ";
    } else {
      //THROMB;
      msgAlert =
        "Etes-vous sur que  ce patient doit subir une thromobolyse local ? ";
    }

    console.log("DIAG ::::", msgAlert);
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
            if (diag === "RAS") {
              await this.router.navigate([
                "/ras",
                this.dataModalAvis["idDossier"],
                JSON.stringify(this.dataPatient)
              ]);
              this.closeModal();
            } else {
              if (diag == "THROMB") {
                await this.router.navigate([
                  "/thromb-ecg",
                  this.dataModalAvis["idDossier"],
                  JSON.stringify(this.dataPatient)
                ]);
                this.closeModal();
              } else {
                await this.router.navigate([
                  "/treatment-thromb",
                  this.dataModalAvis["idDossier"],
                  JSON.stringify(this.dataPatient)
                ]);
                this.closeModal();
              }
            }
          }
        }
      ]
    });
    await alert.present();
  }
}
