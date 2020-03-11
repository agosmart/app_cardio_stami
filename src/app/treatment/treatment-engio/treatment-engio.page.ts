import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import {
  LoadingController,
  AlertController,
  ModalController
} from "@ionic/angular";
import { PretreatmentModel } from "src/app/models/pretreatment.model";
import { TreatmentModel } from "src/app/models/treatment.model";
import { Router, ActivatedRoute } from "@angular/router";
import { DossierModel } from "src/app/models/dossier.model";
import { GlobalvarsService } from "src/app/services/globalvars.service";
import { DiagResponseData } from "src/app/models/diag.response";
import { Observable } from "rxjs";
import { ServiceAppService } from "src/app/services/service-app.service";
import { PretreatmentResponseData } from "src/app/models/pretreatment.response";
import { ImagePage } from "../../modal/image/image.page";
import { async } from "rxjs/internal/scheduler/async";

@Component({
  selector: "app-treatment-engio",
  templateUrl: "./treatment-engio.page.html",
  styleUrls: ["./treatment-engio.page.scss"]
})
export class TreatmentEngioPage implements OnInit {
  pretreatmentObj: PretreatmentModel;
  treatment: TreatmentModel;
  dataPatient: DossierModel;
  dataReponse: object;

  toggled = false;
  doseHeparine = 0;
  dossierId: number;
  doctorId: number;
  token: string;
  idUser: number;
  returnData: PretreatmentResponseData;
  msgAlert = "";
  urlEcg: string;

  // weight: number;
  // birthdate: string;
  // age: string;
  pretreatmentFormInfos = this.formBuilder.group({
    aspegic: ["", [Validators.required]],
    plavix: ["", [Validators.required]],
    heparine: ["", [Validators.required]]
    // bolus: [false, [Validators.pattern]]
  });

  errorMessages = {
    //bolus: [{ type: "required", message: "" }],
  };

  get aspegic() {
    return this.pretreatmentFormInfos.get("aspegic");
  }
  get plavix() {
    return this.pretreatmentFormInfos.get("plavix");
  }
  get heparine() {
    return this.pretreatmentFormInfos.get("heparine");
  }

  /* ------------------------*/
  constructor(
    private formBuilder: FormBuilder,
    private srvApp: ServiceAppService,
    private sglob: GlobalvarsService,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController // private modalCtrl: ModalController,
  ) {
    this.pretreatmentFormInfos.reset();
    this.token = this.sglob.getToken();
    this.idUser = this.sglob.getIdUser();
  }

  ngOnInit() {
    this.sglob.updateInitFetchHome(true);
    console.log("::::debut");
    // console.log("::::dataPatientObj", paramMap.get("dataPatientObj"));
    // this.activatedroute.paramMap.subscribe(paramMap => {
    //   console.log("::::dataPatientObj 0000001", paramMap.get("dataPatientObj"));
    //   if (!paramMap.has("dataPatientObj")) {
    //     this.router.navigate(["/home"]);
    //     console.log("::::dataPatientObj", paramMap.get("dataPatientObj"));
    //   } else {
    //     const dataObj = paramMap.get("dataPatientObj");
    //     this.dataPatient = JSON.parse(dataObj);

    //     const dataObj2 = paramMap.get("dataModalAvis");
    //     this.dataReponse = JSON.parse(dataObj2);
    //     console.log("::::dataReponse", this.dataReponse);
    //     // =================================================
    //     this.doctorId = this.dataPatient.doctorId;
    //     this.dossierId = this.dataPatient.dossierId;
    //     this.urlEcg = this.dataPatient["ecgImage"];

    //     if (this.dataPatient.stepId !== 21) {
    //       this.srvApp.stepUpdatePage(this.dossierId, 21, 6, this.token, 3);
    //     }

    //     // # Calculate Heparine DOSE
    //     const weight = this.dataPatient.weight;
    //     // console.log("weight ::: ", weight);
    //     this.doseHeparine = weight * 60;

    //     console.log(":::: PRETEATMENT sent from DIAGNOSTIC -> dataPatient");
    //     console.group();
    //     console.log(this.dataPatient);
    //     console.group();
    //     console.log("::: weight ::: ", weight);
    //     console.log("::: PRETREATMENT ::::");
    //     console.log("dose Heparine ===> ", this.doseHeparine);
    //     console.groupEnd();
    //     console.groupEnd();
    //   }
    // });

    this.dataPatient = this.srvApp.getExtras();
    console.log("===== dataPatient get  ===", this.dataPatient);
    if (this.dataPatient) {
      this.activatedroute.paramMap.subscribe(paramMap => {
        const dataObj2 = paramMap.get("dataModalAvis");
        this.dataReponse = JSON.parse(dataObj2);
      });
      this.dossierId = this.dataPatient["dossierId"];
      this.doctorId = this.dataPatient.doctorId;
      this.urlEcg = this.dataPatient["ecgImage"];
      if (this.dataPatient.stepId !== 21) {
        this.srvApp.stepUpdatePage(this.dossierId, 21, 6, this.token, 3);
      }

      // # Calculate Heparine DOSE
      const weight = this.dataPatient.weight;
      // console.log("weight ::: ", weight);
      this.doseHeparine = weight * 60;
    } else {
      this.router.navigate(["/home"]);
    }
  }

  // myChange($event) {
  //   console.log('**************************')
  //   console.log('TOGGELE:::', this.toggled);

  // }

  formToggled() {
    // if (this.toggled === false) { this.pretreatmentFormInfos.reset(); }
  }

  initTreatmentObject() {
    this.treatment = { dose: "", name: "", title: "" };
  }

  submitFormInfos() {
    // const bolus = this.pretreatmentFormInfos.value.bolus;
    // if (!bolus) {
    //   this.showAlertConfirme();
    // } else {
    //   this.sendFormInfos();
    // }

    this.showAlertConfirme();
  }

  sendFormInfos() {
    this.pretreatmentObj = {
      dossierId: this.dossierId,
      doctorId: this.doctorId,
      stepId: 23,
      resultId: 6,
      crId: this.dataReponse["idEtab"],
      treatments: []
    };
    const treatmentsArr: Array<TreatmentModel> = [];
    this.initTreatmentObject();

    // const treatment: Array<TreatmentModel> = [];

    // -----------| START LOADING |----------
    this.loadingCtrl
      .create({ keyboardClose: true, message: "Envoi en cours..." })
      .then(loadingEl => {
        loadingEl.present();

        // ############# SET VARIABLS FORM ###############

        const medAspegic = this.pretreatmentFormInfos.value.aspegic;
        const medPlavix = this.pretreatmentFormInfos.value.plavix;
        const medHeparine = this.pretreatmentFormInfos.value.heparine;

        console.group("::: VARIABLS RETRIVED FROM FORM :::: ");
        console.log("medAspegic ::: ", medAspegic);
        console.log("medPlavix ::: ", medPlavix);
        console.log("medHeparine ::: ", medHeparine);
        console.groupEnd();

        if (medAspegic === "1") {
          this.treatment.title = "Aspegic";
          this.treatment.name = "Intraveineux";
          this.treatment.dose = "750 -250mg";
          treatmentsArr.push(this.treatment);
        } else if (medAspegic === "2") {
          this.treatment.title = "Aspegic";
          this.treatment.name = "Per Os";
          this.treatment.dose = "150-300mg";
          treatmentsArr.push(this.treatment);
        }
        this.initTreatmentObject();
        // ---------------------------------------------
        if (medPlavix === "1") {
          this.treatment.title = "Plavix";
          this.treatment.name = "Plavix";
          this.treatment.dose = "300 mg";
          treatmentsArr.push(this.treatment);
        } else if (medPlavix === "2") {
          this.treatment.title = "Plavix";
          this.treatment.name = "TICAGLRELOR";
          this.treatment.dose = "180 mg";
          treatmentsArr.push(this.treatment);
        }
        this.initTreatmentObject();

        // ---------------------------------------------
        if (medHeparine === true) {
          this.treatment.title = "Heparine";
          this.treatment.name = "HÉPARINE NON FRACTIONNÉE IV";
          this.treatment.dose = this.doseHeparine.toString();

          treatmentsArr.push(this.treatment);
        }
        this.initTreatmentObject();
        // ---------------------------------------------

        this.initTreatmentObject();
        this.pretreatmentObj.treatments = treatmentsArr;
        const authObs: Observable<PretreatmentResponseData> = this.srvApp.addPretreatment(
          this.pretreatmentObj,
          this.token
        );
        authObs.subscribe(
          resData => {
            this.returnData = resData;
            if (+this.returnData.code === 201) {
              loadingEl.dismiss();

              this.dataPatient["resultId"] = 6;
              this.dataPatient["lastCrId"] = this.dataReponse["idEtab"];
              this.srvApp.setExtras(this.dataPatient);
              this.router.navigate(["/st"]);
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
            this.sglob.showAlert("Erreur ", errRes.error.message);
          }
        );

        this.pretreatmentFormInfos.reset();
      });

    // -----------| END LOADING |----------
  }

  async showAlertConfirme() {
    const alert = await this.alertCtrl.create({
      header: "Confirmation",
      message: "Etes-vous sur de la liste des médicament donné au patient ?",
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
            this.sendFormInfos();
          }
        }
      ]
    });
    await alert.present();
  }

  // ------------IMAGE ECG ---------------------
  async openImageEcg() {
    console.log("image ::::", this.urlEcg);
    const modal = await this.modalCtrl.create({
      component: ImagePage,
      componentProps: { value: this.urlEcg }
    });
    return await modal.present();
  }
}
