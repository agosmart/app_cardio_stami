import { Component, OnInit } from "@angular/core";
import { ServiceAppService } from "src/app/services/service-app.service";
import { FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { GlobalvarsService } from "src/app/services/globalvars.service";
import { LoadingController, AlertController } from "@ionic/angular";
import {
  ContreIndicListModel,
  ContreIndicElmModel
} from "src/app/models/contre.indic.list.model";
import { PretreatmentResponseData } from "src/app/models/pretreatment.response";


@Component({
  selector: 'app-thromb-relative',
  templateUrl: './thromb-relative.page.html',
  styleUrls: ['./thromb-relative.page.scss'],
})
export class ThrombRelativePage implements OnInit {

  // --------------------------------
  idUser: number;
  token: string;
  dossierId: number;
  typeId: number;
  doctorId: number;
  dataPatient: object;
  resultatId: number;
  contIndAbsObj: ContreIndicListModel;
  contIndAbsElm: ContreIndicElmModel;
  // # Si au moins un contre indication Absolut du form a été vérifiée [ exitProcess = true ]
  exitProcess = false;
  somCheck = 0;
  returnData: PretreatmentResponseData;
  msgAlert = "";
  isDisplayRadio = false;
  isRequiredCheckBox = false;
  hypertentionValue: string;

  // -------------------------
  // listContIndicAbsText = [
  //   'Antécédent d’hémorragie intracrânienne ou d’accident vasculaire cérébral d’origine inconnue, quelle que soit l’ancienneté de l’antécédent',
  //   'Accident vasculaire cérébral ischémique dans les 6 mois précédents ',
  //   'Atteinte ou néoplasme ou malformation artério-veineuse du système nerveux central',
  //   'Traumatisme majeur/chirurgie/blessure céphalique dans le mois précédent ',
  //   'Hémorragie gastro-intestinale dans le mois précédent ',
  //   'Désordre hémorragique connu (hormis les menstrues)',
  //   'Dissection aortique ',
  //   'Points de ponction non compressibles dans les 24 heures précédentes (par exemple, biopsie hépatique, ponction lombaire)',
  //   'Si au moins un de ces pathologies exist c’est une indication de l’Angioplastie primaire'
  // ];
  listContIndicAbs = [
    // tslint:disable-next-line: max-line-length
    {
      text: "Accident ischémique transitoire dans les 6 mois précédents",
      isChecked: false,
      alert: false,
    },
    {
      text:
        "Traitement anticoagulant oral",
      isChecked: false,
      alert: false,
    },
    {
      text: "Grossesse ou post-partum de moins d’une semaine",
      isChecked: false,
      alert: false,
    },
    {
      text: 'Hypertension artérielle réfractaire',
      textNote:
        ['Tension artérielle systolique > 180 mmHg et/ou', 'Tension artérielle diastolique > 110 mmHg'],
      isChecked: false,
      alert: true,
    },
    {
      text: "Maladie hépatique avancée",
      isChecked: false,
      alert: false,
    },
    {
      text: "Endocardite infectieuse ",
      isChecked: false,
      alert: false,
    },
    // tslint:disable-next-line: max-line-length
    {
      text: "Ulcère peptique actif ",
      isChecked: false,
      alert: false,
    },

  ];

  // --------------------------------
  get cia1() {
    return this.contreIndicForm.get("cia1");
  }
  get cia2() {
    return this.contreIndicForm.get("cia2");
  }
  get cia3() {
    return this.contreIndicForm.get("cia3");
  }
  get cia4() {
    return this.contreIndicForm.get("cia4");
  }
  get cia5() {
    return this.contreIndicForm.get("cia5");
  }
  get cia6() {
    return this.contreIndicForm.get("cia6");
  }
  get cia7() {
    return this.contreIndicForm.get("cia7");
  }


  // --------------------------------
  contreIndicForm = this.formBuilder.group({
    cia1: ["", ""],
    cia2: ["", ""],
    cia3: ["", ""],
    cia4: ["", ""],
    cia5: ["", ""],
    cia6: ["", ""],
    cia7: ["", ""],

  });
  // --------------------------------

  constructor(
    private formBuilder: FormBuilder,
    private srvApp: ServiceAppService,
    private sglob: GlobalvarsService,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController // private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.hypertentionValue = '';

    this.idUser = this.sglob.getIdUser();
    this.token = this.sglob.getToken();

    this.activatedroute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("dataPatientObj")) {
        // this.router.navigate(["/home"]);
      } else {
        const dataObj = paramMap.get("dataPatientObj");
        this.dataPatient = JSON.parse(dataObj);

        // =================================================
        this.doctorId = this.dataPatient["doctorId"];
        this.dossierId = this.dataPatient["dossierId"];
        // # typeId = 1 : Formulaire de contre indications Absolus;
        this.typeId = 1;
        // =================================================

        console.log(":::: PRETEATMENT sent from DIAGNOSTIC -> dataPatient");
        console.group();
        console.log("::: FORM TYPE ::: ", this.typeId);
        console.log("dossierId ===>", this.dossierId);
        console.log("doctorId ===> ", this.doctorId);
        console.group();
        console.log(this.dataPatient);
        console.groupEnd();
        console.groupEnd();
      }
    });
  }

  initContIndAbsObject() {
    this.contIndAbsElm = {
      name: "",
      har: 0
    };
    // this.contIndAbsElm.name = '';
    // this.contIndAbsElm.har = 0;
  }
  onCheckBoxChange(isChecked, isAlert) {
    console.log('isAlert :::', isAlert);

    if (isChecked && isAlert) {
      this.presentAlertRadio();
      // # display Alert
      this.isDisplayRadio = true;
      // # You must select one of value 'PAD' OR 'PAS' to submit form
    
      this.hypertentionValue.length > 0 ? this.isRequiredCheckBox = false : this.isRequiredCheckBox = true;
      

      console.group( 'ENABLE / DESABLE FORM');

      console.log(" this.hypertentionValue :::>", this.hypertentionValue);
      console.log(" this.isRequiredCheckBox :::>", this.isRequiredCheckBox);
      console.groupEnd();

    } else {
      // # Hide Alert
      this.isDisplayRadio = false;
    }

    if (isChecked) {
      this.somCheck++;
    } else {
      this.somCheck--;
    }
    // ----------------------------------------
    console.log("somCheck :::", this.somCheck);
    this.somCheck ? (this.exitProcess = true) : (this.exitProcess = false);
  }

  submitFormInfos() {
    this.contIndAbsObj = {
      doctorId: this.doctorId,
      dossierId: this.dossierId,
      typeId: 2, // # contre indications Relatives
      contreIndications: []
    };
    // # Init contre indication Object
    this.initContIndAbsObject();

    // -----------| START LOADING |----------

    this.loadingCtrl
      .create({ keyboardClose: true, message: "Envoi en cours..." })
      .then(loadingEl => {
        loadingEl.present();

        // let some = 0;
        for (let i = 1; i < this.listContIndicAbs.length; i++) {
          // console.log('- checkValue ==> ', i, ':', eval("this.contreIndicForm.value.cia" + i));
          const checkValue = eval("this.contreIndicForm.value.cia" + i);
          let thisHar = "0";
          if (checkValue) {
            thisHar = "1";
            // some += thisHar;
            console.log("TEXT ===>", this.listContIndicAbs[i - 1].text);
            this.contIndAbsElm.name = this.listContIndicAbs[i - 1].text;

            //   this.contIndAbsElm.name = this.listContIndicAbsText[i];
          } else {
            thisHar = "0";
            this.contIndAbsElm.name = "";
          }
          // ------------------------------
          this.contIndAbsElm.har = thisHar;
          this.contIndAbsObj.contreIndications.push(this.contIndAbsElm);
          // # Init contre indication Object
          this.initContIndAbsObject();
        }
        // some > 0 ? this.exitProcess = true : this.exitProcess = false;
        // =================================================
        //this.contIndAbsObj.contreIndications = contreIndications;
        // =================================================
        console.group("= CONTRE INDICATION ABSOLUT:::RESULTAT FINAL =");
        console.log(
          "::: SOME CHEKED ::: ",
          this.somCheck,
          " | exitProcess ",
          this.exitProcess
        );
        // console.log('- contre Indications Array ===>', contreIndications);
        console.log("- contre Indications Obj ===> ", this.contIndAbsObj);
        console.groupEnd();
        // ############# END / VARIABLS FORM ###############
        loadingEl.dismiss();
        return null;



        const authObs: Observable<PretreatmentResponseData> = this.srvApp.addContreIndiAbs(
          this.contIndAbsObj,
          this.token
        );

        // ---- Call DIAGNOSTIC function
        authObs.subscribe(
          resData => {
            this.returnData = resData;
            console.log(
              "::: RETOUR DATA CONTRE INDICATION ABSOLUT - Success ! :::",
              this.returnData.code
            );

            if (+this.returnData.code === 201) {
              loadingEl.dismiss();

              // ************ REDIRECTION ****************
              if (this.exitProcess) {
                this.resultatId = 7; //  L’ENGIOPLASTIE a été jugée risquée
                this.router.navigate([
                  "/gocr",
                  this.dossierId,
                  this.resultatId,
                  JSON.stringify(this.dataPatient)
                ]);
              } else {
                this.router.navigate([
                  "/thromb-relative",
                  this.dossierId,
                  JSON.stringify(this.dataPatient)
                ]);
              }
              // ****************************
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
          }
        );

        this.contreIndicForm.reset();
      });
    // -----------| END LOADING |------------
  }
  // --------- ALERT INFO -----------

  async presentAlertRadio() {

    //this.hypertentionValue = "";

    const alert = await this.alertCtrl.create({
      header: 'Radio',
      inputs: [
        // {
        //   name: 'Aucun',
        //   type: 'radio',
        //   label: 'Aucun',
        //   value: '',
        //   checked: true
        // },
        {
          name: 'PAS',
          type: 'radio',
          label: 'PAS',
          value: 'PAS',
          checked: true
        },
        {
          name: 'PAD',
          type: 'radio',
          label: 'PAD',
          value: 'PAD',
          checked: false
        },

      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');

          }
        }, {
          text: 'Ok',
          handler: (data) => {
            console.log('Confirm Ok');
            console.log(JSON.stringify(data));
            this.hypertentionValue = JSON.stringify(data);
            this.isRequiredCheckBox = false;


          }
        }
      ]
    });

    await alert.present();
  }

  // --------- ALERT -----------
  async showAlert(message: string) {
    // -----------END  message dynamic ---------------
    // const alert = await this.alertCtrl.create({
    //   header: "Résultat",
    //   message: message,
    //   cssClass: "alert-css",
    //   buttons: [
    //     {
    //       text: "Annuler",
    //       role: "cancel",
    //       cssClass: "secondary",
    //       handler: () => {
    //         console.log("Confirme Annuler");
    //       }
    //     }
    //   ]
    // });
    // await alert.present();
    ////////////////////////////////////////////////////////////
    // const alert = await this.alertCtrl.create({
    //   header: "Veillez préciser",
    //   message: message,
    //   cssClass: "alert-css",
    //   buttons: [
    //     {
    //       text: "Annuler",
    //       role: "cancel",
    //       cssClass: "secondary",
    //       handler: () => {
    //         console.log("Précision Annulée");
    //       }
    //     },
    //     {
    //       text: "valider",
    //       handler: async () => {
    //         // if (this.dataPatient["demandeAvisId"] !== 0 && diag === "SOS") {
    //         //   this.setDiagnostic("SOS");
    //         // } else {
    //         // }
    //         // await this.onSetDiagnostic(diag);
    //       }
    //     }
    //   ]
    // });
  }





  // ---------------------------------------




}
