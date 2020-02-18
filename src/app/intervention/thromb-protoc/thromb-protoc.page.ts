import { Component, OnInit } from "@angular/core";
import { ServiceAppService } from "src/app/services/service-app.service";
import { FormBuilder, Validators } from "@angular/forms";
import { GlobalvarsService } from "src/app/services/globalvars.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DossierModel } from "src/app/models/dossier.model";
import { ImagePage } from "src/app/modal/image/image.page";
import {
  LoadingController,
  AlertController,
  ModalController
} from "@ionic/angular";
import { Observable } from "rxjs";
import { DossierResponseData } from "src/app/models/dossier.response";
import { AuthResponseData } from "src/app/models/auth.response";
import { ProtocolThromResponseData } from "src/app/models/protocolThromb.response";

@Component({
  selector: "app-thromb-protoc",
  templateUrl: "./thromb-protoc.page.html",
  styleUrls: ["./thromb-protoc.page.scss"]
})
export class ThrombProtocPage implements OnInit {
  idUser: number;
  idEtab: number;
  token: string;
  idDossier: number;
  stepId = 5; // etape Infos Dossier
  tpaval2: number;
  objectInsc: Array<object>;
  dataPatient: object;
  objectRecu: object;
  idDossierToGet: any;
  dataPatients: Array<DossierModel>;
  ecgTmp: string;
  isLoading = false;
  showactilyse = false;
  returnAddInfoDossier: Array<DossierModel>;
  urlEcg: string;
  tnkTpaVal = "";
  tnkTpaValMg: number;
  tnkTpaValUi: number;
  tpaVal = [];
  tpaVal1: string;
  weight: number;
  tpaLabel = "aucun";

  get tpa() {
    return this.protocolFormInfos.get("tpa");
  }

  // get tnktpa() {
  //   return this.protocolFormInfos.get("tnktpa");
  // }

  get consentement() {
    // console.log(this.protocolFormInfos.get("consentement"));
    return this.protocolFormInfos.get("consentement");
  }

  public errorMessages = {
    tpa: [{ type: "required", message: "" }],
    //  tnktpa: [{ type: "required", message: "" }],

    consentement: [
      {
        type: "pattern",
        message: "Le patient doit signer le document avant Thrombolyse"
      }
    ]
  };

  // -------------------------------------
  protocolFormInfos = this.formBuilder.group({
    tpa: ["", [Validators.required]],
    //tnktpa: ["", ""],
    consentement: [true, [Validators.pattern("true")]]
  });

  // Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')

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
    this.sglob.updateInitFetchHome(true);
    this.idUser = this.sglob.getIdUser();
    this.token = this.sglob.getToken();
    this.showactilyse = false;
    this.activatedroute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("dataPatientObj")) {
        // this.router.navigate(['/home']);
      } else {
        const dataObj = paramMap.get("dataPatientObj");
        this.dataPatient = JSON.parse(dataObj);
        console.log("dataPatient protocol ===>", this.dataPatient);
        this.urlEcg = this.dataPatient["ecgImage"];
        this.idDossier = this.dataPatient["dossierId"];
        const age = this.dataPatient["age"];
        this.weight = this.dataPatient["weight"];

        this.tpaval2 = 0.75 * this.weight;
        if (this.tpaval2 > 50) {
          this.tpaval2 = 50;
        }
        this.tpaVal = [
          "15 MG BOLUS IV",
          this.tpaval2 + "mg IV en 30 minutes",
          0.5 * this.weight + "mg IV en 60 minutes"
        ];

        console.log("weight ===>", this.weight);

        if (this.weight < 60) {
          this.tnkTpaValMg = 30;
          this.tnkTpaValUi = 6000;
        } else if (this.weight <= 70) {
          this.tnkTpaValMg = 35;
          this.tnkTpaValUi = 7000;
        } else if (this.weight <= 80) {
          this.tnkTpaValMg = 40;
          this.tnkTpaValUi = 8000;
        } else if (this.weight <= 90) {
          this.tnkTpaValMg = 45;
          this.tnkTpaValUi = 9000;
        } else if (this.weight >= 100) {
          this.tnkTpaValMg = 50;
          this.tnkTpaValUi = 10000;
        }

        if (age >= 75) {
          this.tnkTpaValMg = this.tnkTpaValMg / 2;
          this.tnkTpaValUi = this.tnkTpaValUi / 2;
        }
        this.tnkTpaVal =
          this.tnkTpaValMg + " MG   (  " + this.tnkTpaValUi + " UI) ";

        console.log("weight ===>", this.tnkTpaValUi);

        console.log("tnkTpaVal ===>", this.tnkTpaVal);
      }
    });
  }

  submitFormInfos() {
    console.log(this.protocolFormInfos.value.tpa);
    let params = {};
    if (this.protocolFormInfos.value.tpa === "0") {
      params = {
        dossierId: this.idDossier,
        doctorId: this.idUser,
        alteplase: this.tpaLabel,
        signedDocuments: "1"
      };
    } else {
      params = {
        dossierId: this.idDossier,
        doctorId: this.idUser,
        tenecteplase: this.tnkTpaVal,
        signedDocuments: "1"
      };
    }

    console.log(this.protocolFormInfos.value);
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: "Inscription en cours..." })
      .then(loadingEl => {
        loadingEl.present();

        console.log("params register : ", this.tpaLabel);

        console.log("params register : ", params);
        const authObs: Observable<ProtocolThromResponseData> = this.srvApp.addProtocThromb(
          params,
          this.token
        );
        let message = "";
        // ---- Call Login function
        authObs.subscribe(
          // :::::::::::: ON RESULT ::::::::::
          resData => {
            this.isLoading = false;
            loadingEl.dismiss();
            if (+resData.code === 201) {
              // ------- Reset Form -------
              this.router.navigate([
                "/thromb-result",
                this.idDossier,
                JSON.stringify(this.dataPatient)
              ]);
            } else {
              this.sglob.showAlert("Erreur ", resData.message);
            }
          },

          // ::::::::::::  ON ERROR ::::::::::::
          errRes => {
            console.log(errRes);
            // ----- Hide loader ------
            loadingEl.dismiss();
            // --------- Show Alert --------
            if (errRes.error.errors != null) {
              this.sglob.showAlert("Erreur ", errRes.error.errors.email);
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

  async onCheckBoxChange() {
    //this.hypertentionValue = 0;

    console.log("onCheckBoxChange");
    const alert = await this.alertCtrl.create({
      header: "ALTÉPLASE (TPA) ACTILYSE",
      inputs: [
        {
          name: "tpa0",
          type: "radio",
          label: "15 mg bolus IV",
          value: 0,
          checked: true
        },
        {
          name: "tpa1",
          type: "radio",
          label: "60 mg IV en 30 minutes",
          value: 1,
          checked: false
        },
        {
          name: "tpa02",
          type: "radio",
          label: "40 mg IV en 60 minutes",
          value: 2,
          checked: false
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirm Cancel");
            //this.hypertentionValue = 0;
            // this.listContIndicAbs[3].isChecked = false;

            // this.isRequiredCheckBox = false;

            // console.log("this.hypertentionValue ::", this.hypertentionValue);
          }
        },
        {
          text: "Ok",
          handler: data => {
            console.log("Confirm Ok");
            console.log(JSON.stringify(data));
            switch (data) {
              case 0:
                this.tpaLabel = "15 mg bolus IV";
                break;
              case 1:
                this.tpaLabel = "60 mg IV en 30 minutes";
                break;
              case 2:
                this.tpaLabel = "40 mg IV en 60 minutes";
            }

            console.log("data : ", this.tpaLabel);
          }
        }
      ]
    });
    await alert.present();
    await alert.onDidDismiss().then(data => {
      // if (this.hypertentionValue === 0) {
      //   this.listContIndicAbs[3].isChecked = false;
      //   //   // this.cia4.reset();
      // }
      // this.isRequiredCheckBox = true;
      // this.isRequiredCheckBox = false;
    });
  }

  async openImageEcg() {
    console.log("image ::::", this.urlEcg);
    const modal = await this.modalCtrl.create({
      component: ImagePage,
      componentProps: { value: this.urlEcg }
    });
    return await modal.present();
  }
}
