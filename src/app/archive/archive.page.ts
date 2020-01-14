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
import { ArchiveModel } from "../models/archive.model";
import { ArchiveResponseData } from "../models/archive.response";
import { DetailArchiveModel } from "../models/detail.archive.model";

@Component({
  selector: "app-archive",
  templateUrl: "./archive.page.html",
  styleUrls: ["./archive.page.scss"]
})
export class ArchivePage implements OnInit {
  idPatient: number;
  token: string;
  idUser: number;
  dataPatient: ArchiveModel;
  pageOrig: string;
  idDossierOrig: number;

  ListeDossier: DetailArchiveModel;
  // returnArchiveInfo: Array<PatientModel>;
  returnListeDossier: ArchiveResponseData;
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

  //   //" archive/:patientId/:pageOrig/:idDossierOrig/:dataPatientObj",
  // this.router.navigate([
  //   "/archive",
  //   this.patientId,
  //   this.pageOrig,
  //   this.idDossier,
  //   JSON.stringify(this.dataPatient)

  ngOnInit() {
    this.token = this.sglob.getToken();
    this.idUser = this.sglob.getIdUser();
    this.activatedroute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("dataPatientObj")) {
        this.router.navigate(["/home"]);
      } else {
        const dataObj = paramMap.get("dataPatientObj");
        // console.log(" dataObj >>>>> dataPatient ::: ", dataObj);
        this.dataPatient = JSON.parse(dataObj);
        console.log(" archive  recu  >>>>> dataPatient ::: ", this.dataPatient);
      }

      if (!paramMap.has("pageOrig")) {
        this.router.navigate(["/home"]);
      } else {
        this.pageOrig = paramMap.get("pageOrig");
        console.log("pageOrig archive", this.pageOrig);
      }

      if (!paramMap.has("idDossierOrig")) {
        this.router.navigate(["/home"]);
      } else {
        this.idDossierOrig = +paramMap.get("idDossierOrig");
        console.log("idDossier archive", this.idDossierOrig);
      }

      if (!paramMap.has("patientId")) {
        this.router.navigate(["/home"]);
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
        const authObs: Observable<ArchiveResponseData> = this.srvArchive.getDossierPatient(
          idPatient,
          this.token
        );
        // ---- Call DIAGNOSTIC function
        authObs.subscribe(
          resData => {
            console.log("resData", resData);
            if (+resData.code === 200) {
              loadingEl.dismiss();
              this.returnListeDossier = resData;
              this.ListeDossier = this.returnListeDossier.data[0].dossiers;
              // forEach(this.dataPatient.dossiers, function(child) {
              //   this.ListeDossier.push(child);
              // });

              console.log("ListeDossier", this.ListeDossier);
            } else {
              loadingEl.dismiss();
              this.sglob.showAlert(
                "Erreur ",
                "Prblème interne, veuillez réessyer"
              );
            }
          },
          errRes => {
            loadingEl.dismiss();
            if (errRes.error.status === 401 || errRes.error.status === 500) {
              this.sglob.showAlert("Erreur ", "Accès à la ressource refusé");
            } else {
              console.log("RETOUR ERROR DIAGNOSTIC:::", errRes);
              this.sglob.showAlert(
                "Erreur ",
                "Prblème d'accès au réseau, veillez vérifier votre connexion"
              );
            }
          }
        );
      });
  }

  showDetail(dossierId) {
    console.log("dossierId:::", dossierId);
  }

  backToOrig() {
    console.log("backToOrig:::");
    this.router.navigate([
      "/" + this.pageOrig,
      this.idDossierOrig,
      JSON.stringify(this.dataPatient)
    ]);
  }
}
