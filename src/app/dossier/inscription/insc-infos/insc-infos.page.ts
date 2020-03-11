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
import { DomSanitizer } from "@angular/platform-browser";

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
  stepId = 5;
  objectInsc: Array<object>;
  dataPatient: DossierModel;
  objectRecu: object;
  idDossierToGet: any;
  dataPatients: Array<DossierModel>;
  ecgTmp: string;
  isLoading = false;
  returnAddInfoDossier: Array<DossierModel>;
  urlEcg: string;
  dThorasicVal = 0;

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
    diabetes: ["", ""],
    hta: ["", ""],
    tobacco: ["", ""],
    dyslip: ["", ""],
    insCardiaque: ["", ""],
    cardIscStable: ["", ""],
    sca: ["", ""],
    angioCoran: ["", ""]
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
    private modalCtrl: ModalController,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.idUser = this.sglob.getIdUser();
    this.idEtab = this.sglob.getidEtab();
    this.token = this.sglob.getToken();
    this.urlEcg = this.sglob.getUrlEcg();

    this.sglob.updateInitFetchHome(true);

    // this.activatedroute.paramMap.subscribe(paramMap => {
    //   if (!paramMap.has("dataPatientObj")) {
    //     /* ========================================
    //               Redirection to Home
    //    =========================================== */
    //     this.router.navigate(["/home"]);
    //   } else {
    //     // this.dataPatient = JSON.parse(paramMap.get("dataPatientObj"));
    //     this.objectRecu = JSON.parse(paramMap.get("dataPatientObj"));
    //     this.dataPatient = this.objectRecu;
    //     if (this.dataPatient["dThorasic"] === true) {
    //       this.dThorasicVal = 1;
    //     }
    //     console.log("===== dataPatient recu infos  ===", this.dataPatient);
    //     console.log("===== dThorasicVal recu infos  ===", this.dThorasicVal);
    //     this.urlEcg = this.dataPatient["ecgImage"];
    //   }
    //   //idDossier
    //   if (!paramMap.has("idDossier")) {
    //     /* ========================================
    //               Redirection to Home
    //    =========================================== */
    //     this.router.navigate(["/home"]);
    //   } else {
    //     this.idDossier = +paramMap.get("idDossier");
    //     this.ecgTmp = this.dataPatient["ecgTmp"];
    //   }
    // });
    console.log("===== dataPatient get 000  ===", this.dataPatient);
    this.dataPatient = this.srvApp.getExtras();
    console.log("===== dataPatient get  ===", this.dataPatient);

    if (this.dataPatient) {
      if (this.dataPatient["dThorasic"] === "1") {
        this.dThorasicVal = 1;
      }
      this.idDossier = this.dataPatient["dossierId"];
      this.urlEcg = this.dataPatient["ecgImage"];
      this.ecgTmp = this.dataPatient["ecgTmp"];
    } else {
      this.router.navigate(["/home"]);
    }
  }

  async openImageEcg() {
    const modal = await this.modalCtrl.create({
      component: ImagePage,
      componentProps: { value: this.urlEcg }
    });
    return await modal.present();
  }
  radioChecked() {
    // this.cheked = this.pretreatmentFormInfos.value.bolus;
    //  console.log(this.inscriptionFormInfos.value.bolus);
  }
  submitFormInfos() {
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: "Ajout  en cours..." })
      .then(loadingEl => {
        loadingEl.present();
        let valHta = "0";
        if (this.inscriptionFormInfos.value.hta === true) {
          valHta = "1";
        }
        let valtobacco = "0";
        if (this.inscriptionFormInfos.value.tobacco === true) {
          valtobacco = "1";
        }
        let valinsCardiaque = "0";
        if (this.inscriptionFormInfos.value.insCardiaque === true) {
          valinsCardiaque = "1";
        }
        let valcardIscStable = "0";
        if (this.inscriptionFormInfos.value.cardIscStable === true) {
          valcardIscStable = "1";
        }

        if (this.inscriptionFormInfos.value.diabetes === "") {
          this.inscriptionFormInfos.value.diabetes = "0";
        }

        if (this.inscriptionFormInfos.value.dyslip === "") {
          this.inscriptionFormInfos.value.dyslip = "0";
        }

        if (this.inscriptionFormInfos.value.sca === "") {
          this.inscriptionFormInfos.value.sca = "0";
        }

        if (this.inscriptionFormInfos.value.angioCoran === "") {
          this.inscriptionFormInfos.value.angioCoran = "0";
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
            loadingEl.dismiss();
            if (+resData.code === 201) {
              console.log("infos set", this.dataPatient);
              this.router.navigate(["./diagnostic"]);
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
              this.sglob.showAlert("Erreur ", errRes.error.message);
            } else {
              this.sglob.showAlert(
                "Erreur ",
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
}
