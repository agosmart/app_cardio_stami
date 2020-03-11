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
  selector: "app-treatment-thromb",
  templateUrl: "./treatment-thromb.page.html",
  styleUrls: ["./treatment-thromb.page.scss"]
})
export class TreatmentThrombPage implements OnInit {
  pretreatmentObj: PretreatmentModel;
  treatment: TreatmentModel;
  dataPatient: DossierModel;
  doseEnoxaparine = 0;
  toggled = false;
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
  pretreatmentFormThromb = this.formBuilder.group({
    aspegic: ["", [Validators.required]],
    plavix: ["", [Validators.required]],
    enoxaparine: ["", [Validators.required]]
  });

  errorMessages = {
    //bolus: [{ type: "required", message: "" }],
  };

  get aspegic() {
    return this.pretreatmentFormThromb.get("aspegic");
  }
  get plavix() {
    return this.pretreatmentFormThromb.get("plavix");
  }
  get enoxaparine() {
    return this.pretreatmentFormThromb.get("enoxaparine");
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
    this.pretreatmentFormThromb.reset();
    this.token = this.sglob.getToken();
    this.idUser = this.sglob.getIdUser();
  }

  ngOnInit() {
    this.sglob.updateInitFetchHome(true);
    this.activatedroute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("dataPatientObj")) {
        this.router.navigate(["/home"]);
      } else {
        const dataObj = paramMap.get("dataPatientObj");
        this.dataPatient = JSON.parse(dataObj);
        // =================================================
        this.doctorId = this.dataPatient.doctorId;
        this.dossierId = this.dataPatient.dossierId;
        this.urlEcg = this.dataPatient["ecgImage"];

        if (this.dataPatient.stepId !== 22) {
          this.srvApp.stepUpdatePage(this.dossierId, 22, 8, this.token, 4);
        }

        // # Calculate Heparine DOSE
        const weight = this.dataPatient.weight;
        // console.log("weight ::: ", weight);

        const age = this.dataPatient["age"];
        if (age <= 75) {
          this.doseEnoxaparine = weight * 0.75;
        } else {
          this.doseEnoxaparine = 30;
        }

        console.log(":::: PRETEATMENT sent from DIAGNOSTIC -> dataPatient");
        console.group();
        console.log(this.dataPatient);
        console.group();
        console.log("::: weight ::: ", weight);
        console.log("::: PRETREATMENT ::::");
        console.groupEnd();
        console.groupEnd();
      }
    });
  }

  // myChange($event) {
  //   console.log('**************************')
  //   console.log('TOGGELE:::', this.toggled);

  // }

  formToggled() {
    //this.toggled = this.pretreatmentFormInfos.value.bolus;
    // if (this.toggled === false) { this.pretreatmentFormInfos.reset(); }
    console.log(this.pretreatmentFormThromb.value.bolus);
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
      stepId: 8,
      resultId: 6,
      crId: 1,
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
        const medAspegic = this.pretreatmentFormThromb.value.aspegic;
        const medPlavix = this.pretreatmentFormThromb.value.plavix;
        const medEnoxaparine = this.pretreatmentFormThromb.value.enoxaparine;

        console.group("::: VARIABLS RETRIVED FROM FORM :::: ");
        console.log("medAspegic ::: ", medAspegic);
        console.log("medPlavix ::: ", medPlavix);
        console.log("medEnoxaparine ::: ", medEnoxaparine);
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
        }

        this.initTreatmentObject();
        // ---------------------------------------------
        if (medEnoxaparine === "1") {
          this.treatment.title = "Enoxaparine";
          this.treatment.name = "ÉNOXAPARINE";
          this.treatment.dose = this.doseEnoxaparine.toString();
          treatmentsArr.push(this.treatment);
        }

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

              this.router.navigate([
                "/thromb-absolut",
                this.dossierId,
                JSON.stringify(this.dataPatient)
              ]);
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

        this.pretreatmentFormThromb.reset();
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
