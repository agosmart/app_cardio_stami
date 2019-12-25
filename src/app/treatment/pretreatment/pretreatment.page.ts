import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { LoadingController, AlertController } from '@ionic/angular';
import { PretreatmentModel } from 'src/app/models/pretreatment.model';
import { TreatmentModel } from 'src/app/models/treatment.model';
import { Router, ActivatedRoute } from '@angular/router';
import { DossierModel } from 'src/app/models/dossier.model';
import { GlobalvarsService } from 'src/app/services/globalvars.service';
import { DiagResponseData } from 'src/app/models/diag.response';
import { Observable } from 'rxjs';
import { ServiceAppService } from 'src/app/services/service-app.service';
import { PretreatmentResponseData } from 'src/app/models/pretreatment.response';
import { async } from 'rxjs/internal/scheduler/async';

// --------- Preatretment Model ----
// interface TreatmentModel {
//   title: string;
//   name: string;
//   dose: string;
// }
// interface PretreatmentModel {
//   bolus: number;
//   treatments: Array<TreatmentModel>;
// }
//--------------------------------------

@Component({
  selector: 'app-pretreatment',
  templateUrl: './pretreatment.page.html',
  styleUrls: ['./pretreatment.page.scss'],
})
export class PretreatmentPage implements OnInit {
  pretreatmentObj: PretreatmentModel;
  treatment: TreatmentModel;
  dataPatient: DossierModel;

  toggled = false;
  doseHeparine = 0;
  doseEnoxaparine = 0;
  dossierId: number;
  doctorId: number;
  token: string;
  idUser: number;
  returnData: PretreatmentResponseData;
  msgAlert = "";

  // weight: number;
  // birthdate: string;
  // age: string;
  pretreatmentFormInfos = this.formBuilder.group({

    bolus: ["", ""],
    aspegic: ["", ""],
    plavix: ["", ""],
    heparine: ["", ""],
    enoxaparine: ["", ""],
    // bolus: [false, [Validators.pattern]]
  });

  errorMessages = {
    //bolus: [{ type: "required", message: "" }],
  };


  get bolus() {
    //return this.pretreatmentFormInfos.get("bolus");
    return this.pretreatmentFormInfos.get("bolus");
  }
  get aspegic() {
    return this.pretreatmentFormInfos.get("aspegic");
  }
  get plavix() {
    return this.pretreatmentFormInfos.get("plavix");
  }
  get heparine() {
    return this.pretreatmentFormInfos.get("heparine");
  }
  get enoxaparine() {
    return this.pretreatmentFormInfos.get("enoxaparine");
  }




  /* ------------------------*/
  constructor(
    private formBuilder: FormBuilder,
    private srvApp: ServiceAppService,
    private sglob: GlobalvarsService,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    // private modalCtrl: ModalController,
  ) {

    this.pretreatmentFormInfos.reset();
    this.token = this.sglob.getToken();
    this.idUser = this.sglob.getIdUser();

  }


  ngOnInit() {

    this.activatedroute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("dataPatientObj")) {
        this.router.navigate(["/home"]);

      } else {

        const dataObj = paramMap.get("dataPatientObj");
        this.dataPatient = JSON.parse(dataObj)[0];
        // =================================================
        this.doctorId = this.dataPatient.doctorId;
        this.dossierId = this.dataPatient.dossierId;

        // # Calculate Heparine DOSE
        const weight = this.dataPatient.weight;
        // console.log("weight ::: ", weight);
        this.doseHeparine = weight * 60;
        /*
          # Calculate Enoxaparine DOSE
            -1 : If patient Age <= 75 => 0.75mg * Age
            -2 : If patient Age > 75 => 30mg
            this.birthdate = this.dataPatient.patient.birthDay;
            this.getAge(this.birthdate);
        */
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
        console.log("dose Enoxaparine ===>", this.doseEnoxaparine);
        console.log('dose Heparine ===> ', this.doseHeparine);
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
    this.toggled = this.pretreatmentFormInfos.value.bolus;
    //if (this.toggled === false) { this.pretreatmentFormInfos.reset(); }
    console.log(this.pretreatmentFormInfos.value.bolus);
  }

  initTreatmentObject() {
    this.treatment = { dose: "", name: "", title: "" };
  }


  submitFormInfos() {

    this.pretreatmentObj = { bolus: 0, treatments: [], dossierId: null, doctorId: null, stepId: 8 };
    const treatmentsArr: Array<TreatmentModel> = [];
    this.initTreatmentObject();

    const treatment: Array<TreatmentModel> = [];

    this.loadingCtrl
      .create({ keyboardClose: true, message: "Envoi en cours..." })
      .then(loadingEl => {
        loadingEl.present();

        // ############# SET VARIABLS FORM ###############

        let bolus = this.pretreatmentFormInfos.value.bolus;
        let medAspegic = this.pretreatmentFormInfos.value.aspegic;
        let medPlavix = this.pretreatmentFormInfos.value.plavix;
        let medHeparine = this.pretreatmentFormInfos.value.heparine;
        let medEnoxaparine = this.pretreatmentFormInfos.value.enoxaparine;

        console.log('BOLUS ::: ', bolus);
        console.log('medAspegic ::: ', medAspegic);
        console.log('medPlavix ::: ', medPlavix);
        console.log('medHeparine ::: ', medHeparine);
        console.log('medEnoxaparine ::: ', medEnoxaparine);

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
          this.treatment.name = "Angioplastie";
          this.treatment.dose = "300 mg";
          treatmentsArr.push(this.treatment);

        } else if (medPlavix === "2") {

          this.treatment.title = "Plavix";
          this.treatment.name = "Thrombolyse";
          this.treatment.dose = "600 mg";
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
        if (medEnoxaparine === true) {
          this.treatment.title = "Enoxaparine";
          this.treatment.name = "ÉNOXAPARINE";
          this.treatment.dose = this.doseHeparine.toString();
          treatmentsArr.push(this.treatment);
        }

        this.initTreatmentObject();

        // -------------SET FINAL VALUES------------------
        this.pretreatmentObj.stepId = 8;
        this.pretreatmentObj.dossierId = this.dossierId;
        this.pretreatmentObj.doctorId = this.doctorId;
        this.pretreatmentObj.bolus = bolus?1:0;
        this.pretreatmentObj.treatments = treatmentsArr;
        // -------------------------------
        console.log('treatment ::: ', treatmentsArr);
        console.log("pretreatmentObj :::>", this.pretreatmentObj);

        // ############# END / VARIABLS FORM ###############

        const authObs: Observable<PretreatmentResponseData> = this.srvApp.addPretreatment(
          this.pretreatmentObj,
          this.token
        );
        // ---- Call DIAGNOSTIC function
        authObs.subscribe(
          resData => {
            this.returnData = resData;
            //console.log("RETOUR DATA DIAGNOSTIC:::", this.returnData.code);

            if (+this.returnData.code === 201) {
              loadingEl.dismiss();
             
              this.router.navigate(['/intervention']);

            } else {
              loadingEl.dismiss();
              this.msgAlert = "Prblème interne, veuillez réessyer";
              this.showAlert(this.msgAlert);
            }
          },
          errRes => {
            loadingEl.dismiss();
            this.msgAlert = errRes.error.message;
              this.showAlert(this.msgAlert);
            // if ( errRes.error.status === 500) {
            //   this.msgAlert = "Accès à la ressource refusé";
            //   this.showAlert(this.msgAlert);
            // }else if(errRes.error.status === 401){
            //   this.msgAlert = errRes.error.message;
            //   this.showAlert(this.msgAlert);
            // } else {
            //   console.log("RETOUR ERROR DIAGNOSTIC:::", errRes);
            //   this.msgAlert =
            //     "Prblème d'accès au réseau, veillez vérifier votre connexion";
            //   this.showAlert(this.msgAlert);
            // }
          });

        this.pretreatmentFormInfos.reset();
      });

  }

  // --------- ALERT -----------
  async showAlert(message: string) {
    // -----------END  message dynamic ---------------
    const alert = await this.alertCtrl.create({
      header: "Résultat d'authentication",
      message: message,
      cssClass: "alert-css",
      buttons: [
        {
          text: "Annuler",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirme Annuler");
          }
        }
      ]
    });
    await alert.present();
  }
  // ---------------------------------------


  // public getAge(birthdate) {
  //   let birthdate = new Date('1974-07-14');
  //   console.log('birthdate :: ', birthdate);
  //   const now = new Date();
  //   const age = now.getFullYear() - birthdate.getFullYear();
  //   console.log('age', age);
  //   //return age;
  // }


}



        // -------------------------------
/* const params1 = {
   bolus: 1
   dossierId: 1
  doctorId: 61
  stepId: 8
   ,
   treatments: [
     {
       title :'Aspegic',
       name: 'intraveineux',
       dose: '75-250 mg'
     },
     {
       title :'Plavix',
       name: 'angioplastie',
       dose: '300 mg'
     },
     {
       title :'Heparine',
       name: 'Heparine non fractionnée IV',
       dose: '4800 UI'
     },
     {
       title :'Enoxaparine'
       med: 'Enoxaparine',
       dose: '60 mg'
     }
   ]

 };*/
        // -------------------------