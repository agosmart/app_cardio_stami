import { Component, OnInit } from "@angular/core";
import { SrvArchiveService } from "src/app/services/srv-archive.service";
import { GlobalvarsService } from "src/app/services/globalvars.service";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ModalController,
  LoadingController,
  ToastController,
  AlertController
} from "@ionic/angular";
import { Observable } from "rxjs";
import { PatientModel } from "../models/patient.model";
import { PatientResponseData } from "../models/patient.response";
import { DetailDossier } from "../models/detailDossier.model";

@Component({
  selector: "app-archive",
  templateUrl: "./archive.page.html",
  styleUrls: ["./archive.page.scss"]
})
export class ArchivePage implements OnInit {
  idPatient: number;
  token: string;
  idUser: number;
  lastName: string;
  dataPatient: object;
  ListeDossier: object;
  // returnArchiveInfo: Array<PatientModel>;
  returnListeDossier: object;
  msgAlert = "";
  constructor(
    private srvArchive: SrvArchiveService,
    private sglob: GlobalvarsService,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.token = this.sglob.getToken();
    this.idUser = this.sglob.getIdUser();
    this.activatedroute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("patientId")) {
        //this.router.navigate(["/home"]);
      } else {
        this.idPatient = +paramMap.get("patientId");
        console.log("idPatient archive", this.idPatient);
        this.infoPatientDossier(this.idPatient);
      }
    });
  }

  infoPatientDossier(idPatient) {
    this.loadingCtrl
      .create({ keyboardClose: true, message: "Opération en cours..." })
      .then(loadingEl => {
        loadingEl.present();
        const authObs: Observable<PatientResponseData> = this.srvArchive.getDossierPatient(
          idPatient,
          this.token
        );
        // ---- Call DIAGNOSTIC function
        authObs.subscribe(
          resData => {
            console.log("resData", resData);
            if (+resData.code === 200) {
              loadingEl.dismiss();
              this.returnListeDossier = resData.data;
              this.dataPatient = this.returnListeDossier[0];
              this.ListeDossier = this.returnListeDossier[0]["dossiers"];
              // forEach(this.dataPatient.dossiers, function(child) {
              //   this.ListeDossier.push(child);
              // });
              console.log("dataPatient", this.dataPatient["lastName"]);
              this.lastName = this.dataPatient["lastName"];
              console.log("ListeDossier", this.ListeDossier);
            } else {
              loadingEl.dismiss();

              //this.returnListeDossier = resData.data[];
              this.msgAlert = "Prblème interne, veuillez réessyer";
              this.showAlert(this.msgAlert);
            }
          },
          errRes => {
            loadingEl.dismiss();
            if (errRes.error.status === 401 || errRes.error.status === 500) {
              this.msgAlert = "Accès à la ressource refusé";
              this.showAlert(this.msgAlert);
            } else {
              console.log("RETOUR ERROR DIAGNOSTIC:::", errRes);
              this.msgAlert =
                "Prblème d'accès au réseau, veillez vérifier votre connexion";
              this.showAlert(this.msgAlert);
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
