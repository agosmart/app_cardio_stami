import { Component, OnInit } from "@angular/core";
import { ServiceAppService } from "src/app/services/service-app.service";
import { GlobalvarsService } from "src/app/services/globalvars.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DossierModel } from "src/app/models/dossier.model";
import { ModalController, LoadingController, AlertController, ToastController } from '@ionic/angular';
import { ImagePage } from '../../modal/image/image.page';

import { Observable } from 'rxjs';

import { PatientModel } from 'src/app/models/patient.model';
import { PatientResponseData } from 'src/app/models/patient.response';


@Component({
  selector: "app-diagnostic",
  templateUrl: "./diagnostic.page.html",
  styleUrls: ["./diagnostic.page.scss"]
})
export class DiagnosticPage implements OnInit {
  idDossierToGet: number;
  dataPatients: Array<DossierModel>;
  hasHistoric = false;
  dataPatient: object;
  ecgTmp: string;
  idDossier: number;
  token: string;
  returnSearchPatient: Array<PatientModel>;


  //ecgImage = '/assets/images/ecg.jpg';

  constructor(
    private srv: ServiceAppService,
    private sglob: GlobalvarsService,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,


  ) {

    this.token = this.sglob.getToken();
  }

  ngOnInit() {
    this.activatedroute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("dataPatientObj")) {
        this.router.navigate(["/home"]);
      } else {
        const dataObj = paramMap.get("dataPatientObj");
        this.dataPatient = JSON.parse(dataObj)[0];
        // console.log(
        //   " DIAGNOSTIC  recu diag >>>>> dataPatient ::: ",
        //   this.dataPatient
        // );
      }

      if (!paramMap.has("idDossier")) {
        this.router.navigate(["/home"]);
      } else {
        this.idDossier = +paramMap.get("idDossier");
        this.ecgTmp = this.dataPatient["ecgTmp"];
      }
    });
  }

  // ===============  PUBLIC SHow Alert ===============
  // showAlert(message: string) {
  //   this.alertCtrl
  //     .create({
  //       header: "Résultat d'authentication",
  //       message: message,
  //       cssClass: "alert-css",
  //       buttons: ["Okay"]
  //     })
  //     .then(alertEl => alertEl.present());
  // }


  diagnosticRas() {
    this.router.navigate([
      "./ras",
      this.idDossier,
      JSON.stringify(this.dataPatient)
    ]);
  }

  // getDataPatient(id: number) {
  //   console.log("************id==>", id);
  //   return {
  //     ...this.dataPatients.find(dossier => {
  //       return dossier["id_dossier"] === id;
  //     })
  //   };
  // }

  async openImageEcg(image: any) {
    console.log('image ::::', image);
    const modal = await this.modalCtrl.create({
      component: ImagePage,
      componentProps: { value: image }
    });
    return await modal.present();
  }


  async setDiagnosticAlert(diag: string) {

    switch (diag) {
      case 'RAS':
        this.setDiagRas();
        break;
      case 'SOS':

        this.setDiagSos();

        break;
      case 'ST':
        this.setDiagSt();
        break;

      default:
        this.router.navigate(['/home']);
        break;
    }

  }

  // ---- SOS ---
  setDiagSos() {
    console.log('dataPatientObj ::::', this.dataPatient);

    this.router.navigate(['orientation', JSON.stringify(this.dataPatient)]);

  }
  // ---- ST ---
  setDiagSt() {

  }
  // ---- RAS ---
  async setDiagRas() {

    const alert = await this.alertCtrl.create({
      header: 'Le constat des risques',
      cssClass: "alert-css",
     // message: 'Etes-vous sur que le patient est un ST.',
      message: "Etes-vous sur qu'il n'existe pas de facteur de risque d'infarctus connu au moment de diagnostic ?",
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirme Annuler');
          }
        }, {
          text: 'Je confirme',
          handler: async () => {
            const loader = await this.loadingCtrl.create({
              duration: 6000,
              message: 'Envoie en cours...',
              translucent: true,
              cssClass: 'custom-class custom-loading',
            });
            await loader.present();
            const params = {
              lastName: "mamadou",
              firstName: "Touré",
              gender: "2",
              birthDay: "1960-02-15"
            };
            const authObs: Observable<PatientResponseData> = this.srv.getPatient(params, this.token);
            // ---- Call Login function
            await authObs.subscribe(
              // :::::::::::: ON RESULT ::::::::::
              resData => {
                this.returnSearchPatient = resData.data;
                console.log("DATA DIAGNOSTIC:::", this.returnSearchPatient);
              },
              errRes => {
                console.log("ERROR DIAGNOSTIC:::", errRes);
              });

            // await  loader.onWillDismiss().then(async l => { console.log("::: Loading ONDISMISS:::", l) };

            await loader.onWillDismiss().then(async l => {
              const toast = await this.toastCtrl.create({
                showCloseButton: true,
                color: 'dark',
                message: 'Votre constat a été pris en considération.',
                duration: 1500,
                cssClass: 'toast',
                position: 'bottom'
              });
              toast.present();
            });
            await loader.dismiss().then((l) => {
              //this.router.navigate(["./home"]);
              this.diagnosticRas();
            });

          }
        }
      ]
    });
    await alert.present();
  }
}
