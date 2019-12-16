import { Component, OnInit } from "@angular/core";
import { ServiceAppService } from "src/app/services/service-app.service";
import { FormBuilder, Validators } from "@angular/forms";
import { GlobalvarsService } from "src/app/services/globalvars.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DossierModel } from "src/app/models/dossier.model";

@Component({
  selector: "app-insc-infos",
  templateUrl: "./insc-infos.page.html",
  styleUrls: ["./insc-infos.page.scss"]
})
export class InscInfosPage implements OnInit {
  // annee: number;

  // ----------------------------
  idUser: number;
  objectInsc: Array<object>;
  dataPatient: object;
  idDossierToGet: any;
  dataPatients: Array<DossierModel>;
  ecgTmp: string;
  // newDataPatient: object;
  // get startTime() {
  //   //console.log('start:::', this.inscriptionFormInfos.get('startTime'));
  //   return this.inscriptionFormInfos.get('startTime');
  // }
  // FACTEURS_DE RISQUES
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
    private router: Router
  ) {
    /* ----- GEt YEAR From Dat Object------
     const noel = new Date();
     this.annee = noel.getFullYear();
    */

    // ----- GET_DATA_FROM_SERVEICE -------
    /*
    this.idUser = this.sglob.get_idUser();
    this.objectInsc = this.srvApp.getExtras();
    */

    this.idUser = 29;
    this.idDossierToGet = "128";

    this.objectInsc = [
      {
        firsName: "Salim",
        lastName: "Maachi",
        birthday: "14-07-1970",
        idPatient: "3",
        idMed: "98",
        weight: "79",
        imgEcg: "../../assets/images",
        idDossier: "128",
        dThorasic: "1",
        startTime: "13:25:00"
      }
      // {
      //   idPatient: '2',
      //   firsName: 'Mohamed',
      //   lastName: 'Mouallem',
      //   birthday: '14-07-1974',
      //   dossiers: [
      //     {
      //       idDossier: '125',
      //       idMed: '41',
      //       weight: '79',
      //       imgEcg: '../../assets/images',
      //       dThorasic: '1',
      //       startTime: '11:25:50'
      //     },
      //     {
      //       idDossier: '300',
      //       idMed: '42',
      //       weight: '81',
      //       imgEcg: '../../assets/images',
      //       dThorasic: '1',
      //       startTime: '9:00:00'
      //     }
      //   ]
      // },
    ];
  }

  ngOnInit() {
    //this.dataPatient = this.getDataPatient(this.idDossierToGet);
    // this.newDataPatient = this.inscriptionFormInfos.value;
    console.log(" DATA:::", this.dataPatient);

    this.activatedroute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("dataPatientObj")) {
        /* ========================================
                  Redirection to Home
       =========================================== */
        this.router.navigate(["/home"]);
      } else {
        this.dataPatients = JSON.parse(paramMap.get("dataPatientObj"));
        console.log(" moha dataPatients:::", this.dataPatients);
      }
      //idDossier
      if (!paramMap.has("idDossier")) {
        /* ========================================
                  Redirection to Home
       =========================================== */
        this.router.navigate(["/home"]);
      } else {
        const id = +paramMap.get("idDossier");
        /* ========================================
                  Data Patient dossier
        =========================================== */
        this.dataPatient = this.getDataPatient(id);
        console.log(" dataPatient:::", this.dataPatient);
        this.ecgTmp = this.dataPatient["ecgTmp"];
      }
    });
  }

  // ===============  PUBLIC FUNCTIONS ===============
  onShowEcg() {
    console.log("::::::: Show Image ECG :::::::");
  }

  submitFormInfos() {
    // this.dataPatient =  this.getDataPatient( this.idUser);
    console.log("RESULT PATIENT INFOS! :::::", this.dataPatient);
    console.log(
      "RESULT FORM INFOS! :::::BEFORE",
      this.inscriptionFormInfos.value
    );
    // ================ Redirection to DIAGNOSTIC page =============================

    this.router.navigate(["./diagnostic", JSON.stringify(this.dataPatient)]);
  }

  // ======== SERVICES  FUNCTIONS ===============
  getDataAllPatients() {
    return [...this.dataPatients];
  }

  getDataPatient(id: number) {
    console.log("************id==>", id);
    return {
      ...this.dataPatients.find(dossier => {
        return dossier["id_dossier"] === id;
      })
    };
  }

  /*
  for (const key in this.newDataPatient) {
    const value = this.newDataPatient[key];

    console.log('VALUE::', key, ' : ', value);
    console.log('VALUE length::', value.toString().length);

    if (
      value === '' ||
      value.toString().length === 0 ||
      value.toString() === 'false' ||
      value.isNullOrUndefined
    ) {
      //console.log(key);
      this.newDataPatient[key] = 0;
    } else if (value.toString() === 'true') {
      this.newDataPatient[key] = 1;
    }
    // return  this.newDataPatient;
  }
  console.log('RESULT FORM INFOS! :::::AFTER ', this.newDataPatient);
  */
}
