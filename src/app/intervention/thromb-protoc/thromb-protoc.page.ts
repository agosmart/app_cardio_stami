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
import { AuthResponseData } from "src/app/models/auth.response";

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
  urlEcg: string;
  tnkTpaVal = "45 mg (9000 UI)";

  get tpa() {
    return this.protocolFormInfos.get("tpa");
  }

  get tnktpa() {
    return this.protocolFormInfos.get("tnktpa");
  }

  get consentement() {
    return this.protocolFormInfos.get("consentement");
  }

  public errorMessages = {
    tpa: [{ type: "required", message: "" }],
    tnktpa: [{ type: "required", message: "" }],
    consentement: [
      { type: "required", message: "" },
      {
        type: "pattern",
        message: "Le patient doit signer le document avant la Thrombolyse"
      }
    ]
  };

  // -------------------------------------
  protocolFormInfos = this.formBuilder.group({
    tpa: ["", ""],
    tnktpa: ["", ""],
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
    // this.hypertentionValue = 0;

    this.idUser = this.sglob.getIdUser();
    this.token = this.sglob.getToken();

    this.activatedroute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("dataPatientObj")) {
        // this.router.navigate(['/home']);
      } else {
        const dataObj = paramMap.get("dataPatientObj");
        this.dataPatient = JSON.parse(dataObj);
        // this.doctorId = this.dataPatient["doctorId"];
        this.idDossier = this.dataPatient["dossierId"];
      }
    });
  }

  submitFormInfos() {
    console.log(this.protocolFormInfos.value);
    // this.isLoading = true;
    // this.loadingCtrl
    //   .create({ keyboardClose: true, message: "Inscription en cours..." })
    //   .then(loadingEl => {
    //     loadingEl.present();

    //     let params = this.protocolFormInfos.value;
    //     params["userType"] = 2;
    //     console.log("params register : ", params);
    //     const authObs: Observable<AuthResponseData> = this.srvApp.registerDoctor(
    //       params
    //     );
    //     let message = "";
    //     // ---- Call Login function
    //     authObs.subscribe(
    //       // :::::::::::: ON RESULT ::::::::::
    //       resData => {
    //         this.isLoading = false;
    //         // const dataResponse: UserModel = JSON.stringify(resData.data);
    //         const dataResponse: UserModel = resData.data;
    //         console.log("Response >>>>> ", resData);
    //         console.log("Response code >>>>> ", resData.code);
    //         // ----- Hide loader ------
    //         loadingEl.dismiss();
    //         if (+resData.code === 201) {
    //           // ------- Reset Form -------
    //           //this.registrationForm.reset();
    //           // ----- Toast ------------
    //           this.sglob.presentToast(resData.message);
    //           // ----- Redirection to login page ------------
    //           this.router.navigate(["./login"]);
    //         } else {
    //           // --------- Show Alert --------
    //           this.showAlert(resData.message);
    //         }
    //       },

    //       // ::::::::::::  ON ERROR ::::::::::::
    //       errRes => {
    //         console.log(errRes);
    //         // ----- Hide loader ------
    //         loadingEl.dismiss();
    //         // --------- Show Alert --------
    //         if (errRes.error.errors != null) {
    //           this.showAlert(errRes.error.errors.email);
    //         } else {
    //           this.showAlert(
    //             "Prblème d'accès au réseau, veillez vérifier votre connexion"
    //           );
    //         }
    //       }
    //     );
    //   });
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
