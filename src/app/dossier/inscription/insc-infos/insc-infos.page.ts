import { Component, OnInit } from "@angular/core";
import { ServiceAppService } from "src/app/services/service-app.service";
import { FormBuilder, Validators } from "@angular/forms";
import { GlobalvarsService } from "src/app/services/globalvars.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DossierModel } from "src/app/models/dossier.model";
import {
  LoadingController,
  AlertController,
  ModalController
} from "@ionic/angular";
import { Observable } from "rxjs";
import { DossierResponseData } from "src/app/models/dossier.response";
import { ImagePage } from "../../../modal/image/image.page";

@Component({
  selector: "app-insc-infos",
  templateUrl: "./insc-infos.page.html",
  styleUrls: ["./insc-infos.page.scss"]
})
export class InscInfosPage implements OnInit {
  // annee: number;

  // ----------------------------
  idUser: number;
  idEtab: number;
  token: string;
  idDossier: number;
  stepId = 5; // etape Infos Dossier
  objectInsc: Array<object>;
  //dataPatient: DossierModel;
  //dataPatient: DossierModel;
  dataPatient: object;
  objectRecu: object;
  idDossierToGet: any;
  dataPatients: Array<DossierModel>;
  ecgTmp: string;
  isLoading = false;
  returnAddInfoDossier: Array<DossierModel>;

  ecgImage = "/assets/images/ecg.jpg";

  get diabetes() {
    return this.inscriptionFormInfos.get("diabetes");
  }
  get hta() {
    return this.inscriptionFormInfos.get("hta");
  }
  get tobacco() {
    return this.inscriptionFormInfos.get("tobacco");
  }
  // DISLIPIDIMIE
  get dyslip() {
    return this.inscriptionFormInfos.get("dyslip");
  }
  // // ANTECEDENTS_CARDIOLOGIQUE
  get insCardiaque() {
    return this.inscriptionFormInfos.get("insCardiaque");
  }
  get cardIscStable() {
    return this.inscriptionFormInfos.get("cardIscStable");
  }
  get sca() {
    return this.inscriptionFormInfos.get("sca");
  }
  get angioCoran() {
    return this.inscriptionFormInfos.get("angioCoran");
  }
  get daignoDate() {
    return this.inscriptionFormInfos.get("daignoDate");
  }
  get atlDate() {
    return this.inscriptionFormInfos.get("atlDate");
  }
  // ------------ Message d'erreurs -----------------

  public errorMessages = {
    diabetes: [{ type: "required", message: "" }],
    dyslip: [{ type: "required", message: "" }],
    sca: [{ type: "required", message: "" }],
    angioCoran: [{ type: "required", message: "" }]
  };

  // -------------------------------------
  inscriptionFormInfos = this.formBuilder.group({
    daignoDate: ["", ""],
    atlDate: ["", ""],
    diabetes: ["", [Validators.required]],
    hta: ["", ""],
    tobacco: ["", ""],
    dyslip: ["", [Validators.required]],
    insCardiaque: ["", ""],
    cardIscStable: ["", ""],
    sca: ["", [Validators.required]],
    angioCoran: ["", [Validators.required]]
  });

  // ===============  CONSTRUCTOR ===============
  constructor(
    private formBuilder: FormBuilder,
    private srvApp: ServiceAppService,
    private sglob: GlobalvarsService,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.idUser = this.sglob.getIdUser();
    this.idEtab = this.sglob.getidEtab();
    this.token = this.sglob.getToken();
    this.activatedroute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("dataPatientObj")) {
        /* ========================================
                  Redirection to Home
       =========================================== */
        this.router.navigate(["/home"]);
      } else {
        // this.dataPatient = JSON.parse(paramMap.get("dataPatientObj"));
        this.objectRecu = JSON.parse(paramMap.get("dataPatientObj"));
        this.dataPatient = this.objectRecu;
        console.log("===== dataPatient recu infos  ===", this.dataPatient);
      }
      //idDossier
      if (!paramMap.has("idDossier")) {
        /* ========================================
                  Redirection to Home
       =========================================== */
        this.router.navigate(["/home"]);
      } else {
        this.idDossier = +paramMap.get("idDossier");
        this.ecgTmp = this.dataPatient["ecgTmp"];
      }
    });
  }

  radioChecked() {
    // this.cheked = this.pretreatmentFormInfos.value.bolus;
    console.log(this.inscriptionFormInfos.value.bolus);
  }
  // ===============  PUBLIC FUNCTIONS ===============

  submitFormInfos() {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: "Ajout  en cours..." })
      .then(loadingEl => {
        loadingEl.present();
        let valHta = 0;
        if (this.inscriptionFormInfos.value.hta === true) {
          valHta = 1;
        }
        let valtobacco = 0;
        if (this.inscriptionFormInfos.value.tobacco === true) {
          valtobacco = 1;
        }
        let valinsCardiaque = 0;
        if (this.inscriptionFormInfos.value.insCardiaque === true) {
          valinsCardiaque = 1;
        }
        let valcardIscStable = 0;
        if (this.inscriptionFormInfos.value.cardIscStable === true) {
          valcardIscStable = 1;
        }
        const params = {
          dossierId: this.idDossier,
          doctorId: this.idUser,
          diabetes: this.inscriptionFormInfos.value.diabetes,
          dyslip: this.inscriptionFormInfos.value.dyslip,
          sca: this.inscriptionFormInfos.value.sca,
          angioCoran: this.inscriptionFormInfos.value.angioCoran,
          hta: valHta,
          tobacco: valtobacco,
          insCardiaque: valinsCardiaque,
          cardIscStable: valcardIscStable,
          daignoDate: this.inscriptionFormInfos.value.daignoDate.substr(0, 4),
          atlDate: this.inscriptionFormInfos.value.atlDate.substr(0, 4),
          stepId: this.stepId
        };

        const authObs: Observable<DossierResponseData> = this.srvApp.addInfoDossier(
          params,
          this.token
        );
        authObs.subscribe(
          resData => {
            this.isLoading = false;
            this.returnAddInfoDossier = resData.data;
            console.log("envoie vers diag >>>>> ", this.dataPatient);
            loadingEl.dismiss();
            if (+resData.code === 201) {
              this.router.navigate([
                "./diagnostic",
                this.idDossier,
                JSON.stringify([this.dataPatient])
              ]);
            } else {
              // ----- Hide loader ------
              loadingEl.dismiss();
            }
          },

          // ::::::::::::  ON ERROR ::::::::::::
          errRes => {
            console.log(errRes);
            // ----- Hide loader ------
            loadingEl.dismiss();

            // --------- Show Alert --------

            if (errRes.error.code === "401") {
              this.showAlert(errRes.error.message);
            } else {
              this.showAlert(
                "Prblème d'accès au réseau, veillez vérifier votre connexion"
              );
            }
          }
        );
      });
  }

  // ======== SERVICES  FUNCTIONS ===============
  getDataAllPatients() {
    return [...this.dataPatients];
  }

  getDataPatient(id: number) {
    return {
      ...this.dataPatients.find(dossier => {
        return dossier["id_dossier"] === id;
      })
    };
  }

  async openImageEcg(image: any) {
    console.log("image ::::", image);
    const modal = await this.modalCtrl.create({
      component: ImagePage,
      componentProps: { value: image }
    });
    return await modal.present();
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
