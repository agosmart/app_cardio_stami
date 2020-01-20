import { Component, OnInit } from "@angular/core";
import { ServiceAppService } from "src/app/services/service-app.service";
import { GlobalvarsService } from "src/app/services/globalvars.service";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ModalController,
  LoadingController,
  AlertController
} from "@ionic/angular";
import { ImagePage } from "src/app/modal/image/image.page";
import { DossierModel } from "src/app/models/dossier.model";

@Component({
  selector: "app-thromb-result",
  templateUrl: "./thromb-result.page.html",
  styleUrls: ["./thromb-result.page.scss"]
})
export class ThrombResultPage implements OnInit {
  idUser: number;
  token: string;
  dossierId: number;
  typeId: number;
  doctorId: number;
  resultatId: number;
  urlEcg: string;
  //dataPatient: object;
  dataPatient: DossierModel;
  constructor(
    private srvApp: ServiceAppService,
    private sglob: GlobalvarsService,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    // this.hypertentionValue = 0;

    this.idUser = this.sglob.getIdUser();
    this.token = this.sglob.getToken();

    this.activatedroute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("dataPatientObj")) {
        // this.router.navigate(['/home']);
      } else {
        const dataObj = paramMap.get("dataPatientObj");
        this.dataPatient = JSON.parse(dataObj);
        this.doctorId = this.dataPatient["doctorId"];
        this.dossierId = this.dataPatient["dossierId"];
        this.urlEcg = this.dataPatient["ecgImage"];
        console.log("IMAGE ECG :::", this.urlEcg);
        if (this.dataPatient["stepId"] !== 18) {
          this.srvApp.stepUpdatePage(this.dossierId, 18, 11, this.token);
        }
      }
    });
  }

  // --------- ALERT CONFIRME -----------

  async showAlertConfirme(resultatId: number) {
    let msgAlert = "";
    if (resultatId === 10) {
      //NON RÉUSSIT
      msgAlert =
        "Le CR doit appliquer l’Angioplastie de sauvettage au patient, merci de choisir le CR";
    } else if (resultatId === 11) {
      //RÉUSSIT
      msgAlert = " Thromobolyse réussit, merci de choisir le CR ? ";
    } else {
      //SANS RÉSULTAT
      msgAlert = "Thromobolyse faite sans  résultat, merci de choisir le CR ? ";
    }

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
            this.dataPatient.resultId = resultatId;
            this.router.navigate([
              "/envoi-cr",
              this.dossierId,
              JSON.stringify(this.dataPatient)
            ]);
          }
        }
      ]
    });
    await alert.present();
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
