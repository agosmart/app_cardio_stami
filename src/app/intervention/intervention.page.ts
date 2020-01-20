import { Component, OnInit } from "@angular/core";
import { ServiceAppService } from "src/app/services/service-app.service";
import { GlobalvarsService } from "src/app/services/globalvars.service";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ModalController,
  LoadingController,
  AlertController,
  ToastController
} from "@ionic/angular";
import { ImagePage } from "../modal/image/image.page";
import { DossierModel } from "../models/dossier.model";
@Component({
  selector: "app-intervention",
  templateUrl: "./intervention.page.html",
  styleUrls: ["./intervention.page.scss"]
})
export class InterventionPage implements OnInit {
  dataPatient: DossierModel;
  idDossier: number;
  token: string;
  idUser: number;
  stepId: number;
  resultatId = 0;
  urlEcg: string;

  // -----------------------------
  msgAlert = "";

  constructor(
    private sglob: GlobalvarsService,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController
  ) {
    this.token = this.sglob.getToken();
    this.idUser = this.sglob.getIdUser();
  }

  ngOnInit() {
    this.activatedroute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("dataPatientObj")) {
        console.log("----AUCUNE DATA DISPO ----");
        // this.router.navigate(["/home"]);
      } else {
        const dataObj = paramMap.get("dataPatientObj");

        this.dataPatient = JSON.parse(dataObj);

        console.log(
          " DIAGNOSTIC  recu diag >>>>> dataPatient ::: ",
          this.dataPatient
        );
      }

      if (!paramMap.has("idDossier")) {
        this.router.navigate(["/home"]);
      } else {
        this.idDossier = +paramMap.get("idDossier");
        this.urlEcg = this.dataPatient["ecgImage"];
        console.log("IMAGE ECG :::", this.urlEcg);
      }
    });
  }

  // --------- ALERT CONFIRME -----------

  async showAlertConfirme(inter: string) {
    let msgAlert = "";
    // ----------- message dynamic ---------------

    if (inter === "GOCR") {
      this.stepId = 8;
      msgAlert = "Etes-vous sur d'envoyer le patient au Centre de référence ?";
    } else if (inter === "ENGIO") {
      this.stepId = 11;
      msgAlert =
        "Etes-vous sur que le patient nécessit une intervention Engioplastie ? ";
    } else {
      this.stepId = 12;
      msgAlert =
        "Etes-vous sur que le patient nécessit une intervention de type Thrombolyse ? ";
    }

    console.log("INTERVENTION ::::", msgAlert);
    // -----------END  message dynamic ---------------
    const alert = await this.alertCtrl.create({
      header: "Résultat d'intervention",
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
            await this.setIntervention(inter);
          }
        }
      ]
    });
    await alert.present();
  }

  // =================================
  //  setDiagnostic()
  // =================================

  async setIntervention(inter: string) {
    switch (inter) {
      case "GOCR":
        // ---- CR ---
        this.dataPatient.resultId = 6; // aucune intervention envoi direct au CR
        console.log(
          "setIntervention resultId ===>",
          this.dataPatient["resultId"]
        );
        await this.router.navigate([
          "/envoi-cr",
          this.idDossier,
          JSON.stringify(this.dataPatient)
        ]);
        break;

      case "ENGIO":
        // ---- ENGIO ---
        console.log(
          "dataPatientObj ::::----> ENGIO INTERVENTION ::",
          this.dataPatient
        );
        await this.router.navigate([
          "/engio",
          this.idDossier,
          JSON.stringify(this.dataPatient)
        ]);
        break;

      case "THROMB":
        // ---- THROMPBOLYSE ---
        console.log(
          "dataPatientObj ::::----> THROMBOLYSE INTERVENTION :: ",
          this.dataPatient
        );
        await this.router.navigate([
          "/thromb-absolut",
          this.idDossier,
          JSON.stringify(this.dataPatient)
        ]);
        break;

      default:
        this.router.navigate(["/home"]);
        break;
    }
  }

  // ------------IMAGE ECG ---------------------
  async openImageEcg(image: any) {
    console.log("image ::::", image);
    const modal = await this.modalCtrl.create({
      component: ImagePage,
      componentProps: { value: image }
    });
    return await modal.present();
  }
}
