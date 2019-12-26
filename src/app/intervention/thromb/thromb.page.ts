import { Component, OnInit } from '@angular/core';
import { ServiceAppService } from 'src/app/services/service-app.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GlobalvarsService } from 'src/app/services/globalvars.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { ContreIndicListModel, ContreIndicElmModel } from 'src/app/models/contre.indic.list.model';
import { PretreatmentResponseData } from 'src/app/models/pretreatment.response';

@Component({
  selector: 'app-thromb',
  templateUrl: './thromb.page.html',
  styleUrls: ['./thromb.page.scss'],
})
export class ThrombPage implements OnInit {
  // --------------------------------
  idUser: number;
  token: string;
  dossierId: number;
  typeId: number;
  doctorId: number;
  dataPatient: object;

  contIndAbsObj: ContreIndicListModel;
  contIndAbsElm: ContreIndicElmModel;
  // # Si au moins un contre indication Absolut du form a été vérifiée [ exitProcess = true ]
  exitProcess = false;
  somCheck = 0;

  returnData: PretreatmentResponseData;
  msgAlert = '';
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
    { text: 'Antécédent d’hémorragie intracrânienne ou d’accident vasculaire cérébral d’origine inconnue, quelle que soit l’ancienneté de l’antécédent', isChecked: false },
    { text: 'Accident vasculaire cérébral ischémique dans les 6 mois précédents ', isChecked: false },
    { text: 'Atteinte ou néoplasme ou malformation artério-veineuse du système nerveux central', isChecked: false },
    { text: 'Traumatisme majeur/chirurgie/blessure céphalique dans le mois précédent ', isChecked: false },
    { text: 'Hémorragie gastro-intestinale dans le mois précédent', isChecked: false },
    { text: 'Désordre hémorragique connu (hormis les menstrues)', isChecked: false },
    // tslint:disable-next-line: max-line-length
    { text: 'Points de ponction non compressibles dans les 24 heures précédentes (par exemple, biopsie hépatique, ponction lombaire)', isChecked: false },
    { text: 'Si au moins un de ces pathologies exist c’est une indication de l’Angioplastie primaire', isChecked: false },
  ];

  // --------------------------------
  get cia1() {
    return this.contreIndicForm.get('cia1');
  }
  get cia2() {
    return this.contreIndicForm.get('cia2');
  }
  get cia3() {
    return this.contreIndicForm.get('cia3');
  }
  get cia4() {
    return this.contreIndicForm.get('cia4');
  }
  get cia5() {
    return this.contreIndicForm.get('cia5');
  }
  get cia6() {
    return this.contreIndicForm.get('cia6');
  }
  get cia7() {
    return this.contreIndicForm.get('cia7');
  }
  get cia8() {
    return this.contreIndicForm.get('cia8');
  }

  // --------------------------------
  contreIndicForm = this.formBuilder.group({
    cia1: ['', ''],
    cia2: ['', ''],
    cia3: ['', ''],
    cia4: ['', ''],
    cia5: ['', ''],
    cia6: ['', ''],
    cia7: ['', ''],
    cia8: ['', ''],
  });
  // --------------------------------

  constructor(
    private formBuilder: FormBuilder,
    private srvApp: ServiceAppService,
    private sglob: GlobalvarsService,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    // private modalCtrl: ModalController
  ) {


  }

  ngOnInit() {



    this.idUser = this.sglob.getIdUser();
    this.token = this.sglob.getToken();

    this.activatedroute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('dataPatientObj')) {
        // this.router.navigate(["/home"]);

      } else {

        const dataObj = paramMap.get('dataPatientObj');
        this.dataPatient = JSON.parse(dataObj);

        this.dataPatient = {
          patientId: 1,
          lastName: 'Bouaziz',
          firstName: 'Touré',
          gender: '2',
          birthDay: '1960-02-15',
          birthDayFr: '1960-02-15',
          age: 45,

        };
        this.token = 'OOSlM0N9NF2NGRZRXuB8pIDRMmQeHMbzi61URUhdJA3skNDasle9Hxt0PH5W';
        // =================================================
        this.doctorId = 34; // this.dataPatient['doctorId'];
        this.dossierId = 134; // this.dataPatient['dossierId'];
        // # typeId = 1 : Formulaire de contre indications Absolus;
        this.typeId = 1;
        // =================================================

        console.log(':::: PRETEATMENT sent from DIAGNOSTIC -> dataPatient');
        console.group();
        console.log('::: FORM TYPE ::: ', this.typeId);
        console.log('dossierId ===>', this.dossierId);
        console.log('doctorId ===> ', this.doctorId);
        console.group();
        console.log(this.dataPatient);
        console.groupEnd();
        console.groupEnd();
      }
    });
  }


  initContIndAbsObject() {
    this.contIndAbsElm = {
      name: '',
      har: 0,
    };
    // this.contIndAbsElm.name = '';
    // this.contIndAbsElm.har = 0;

  }
  onCheckBoxChange(isChecked) {
    console.log();
    if (isChecked) {
      this.somCheck++;
    } else {
      this.somCheck--;
    }
    // ----------------------------------------
    console.log('somCheck :::', this.somCheck);
    (this.somCheck) ? this.exitProcess = true : this.exitProcess = false;
  }


  submitFormInfos() {

    this.contIndAbsObj = {
      doctorId: this.doctorId,
      dossierId: this.dossierId,
      typeId: 1,
      contreIndications: [],
    };
    // # Init contre indication Object
    this.initContIndAbsObject();

    // -----------| START LOADING |----------

    this.loadingCtrl
      .create({ keyboardClose: true, message: "Envoi en cours..." })
      .then(loadingEl => {
        loadingEl.present();

        // let some = 0;
        for (let i = 1; i < 9; i++) {

          // console.log('- checkValue ==> ', i, ':', eval("this.contreIndicForm.value.cia" + i));
          const checkValue = eval('this.contreIndicForm.value.cia' + i);
          let thisHar = '0';
          if (checkValue) {
            thisHar = '1';
            // some += thisHar;
            console.log('TEXT ===>', this.listContIndicAbs[i - 1].text);
            this.contIndAbsElm.name = this.listContIndicAbs[i - 1].text;

            //   this.contIndAbsElm.name = this.listContIndicAbsText[i];

          } else {
            thisHar = '0';
            this.contIndAbsElm.name = '';
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
        console.group('= CONTRE INDICATION ABSOLUT:::RESULTAT FINAL =');
        console.log('::: SOME CHEKED ::: ', this.somCheck, ' | exitProcess ', this.exitProcess);
        // console.log('- contre Indications Array ===>', contreIndications);
        console.log('- contre Indications Obj ===> ', this.contIndAbsObj);
        console.groupEnd();
        // ############# END / VARIABLS FORM ###############

        const authObs: Observable<PretreatmentResponseData> = this.srvApp.addContreIndiAbs(this.contIndAbsObj, this.token);

        // ---- Call DIAGNOSTIC function
        authObs.subscribe(
          resData => {
            this.returnData = resData;
            console.log("::: RETOUR DATA CONTRE INDICATION ABSOLUT - Success ! :::", this.returnData.code);

            if (+this.returnData.code === 201) {
              loadingEl.dismiss();

              // ************ REDIRECTION ****************
              if (this.exitProcess) {

                this.router.navigate([
                  '/home'
                ]);

              } else {

                this.router.navigate([
                  '/intervention',
                  this.dossierId,
                  JSON.stringify(this.dataPatient)
                ]);
              }
              // ****************************

            } else {
              loadingEl.dismiss();
              this.msgAlert = 'Prblème interne, veuillez réessyer';
              this.showAlert(this.msgAlert);
            }
          },
          errRes => {
            loadingEl.dismiss();
            this.msgAlert = errRes.error.message;
            this.showAlert(this.msgAlert);
          });

        this.contreIndicForm.reset();



      });
    // -----------| END LOADING |------------

  }
  // --------- ALERT -----------
  async showAlert(message: string) {
    // -----------END  message dynamic ---------------
    const alert = await this.alertCtrl.create({
      header: 'Résultat',
      message: message,
      cssClass: 'alert-css',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirme Annuler');
          }
        }
      ]
    });
    await alert.present();
  }
  // ---------------------------------------




}



/*
{
"doctorId" : 34,
"dossierId" : 134,
"typeId" :  1,
   "contreIndications": [
       {
           "name": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
           "har": "0"
       },
       {
           "name": "Integer pulvinar ante at mattis aliquet.",
           "har": "0"
       },
       {
           "name": "Duis eget enim vestibulum, porttitor ligula eu, ultrices dui.",
           "har": "0" // 1 , 2"
       },
       {
           "name": "Nam in sem lobortis nisi sollicitudin aliquet.",
           "har": "0"
       }
   ]

}
*/
