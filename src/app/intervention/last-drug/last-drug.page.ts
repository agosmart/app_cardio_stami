import { Component, OnInit } from "@angular/core";
import { ServiceAppService } from "src/app/services/service-app.service";
import { GlobalvarsService } from "src/app/services/globalvars.service";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import {
  LoadingController,
  AlertController,
  ModalController
} from "@ionic/angular";
import { Observable } from "rxjs";
import { ClotureResponseData } from "src/app/models/cloture.response";
import { ClotureModel } from "src/app/models/cloture.model";
import { DossierModel } from "src/app/models/dossier.model";
import { DossierResponseData } from "src/app/models/dossier.response";
@Component({
  selector: "app-last-drug",
  templateUrl: "./last-drug.page.html",
  styleUrls: ["./last-drug.page.scss"]
})
export class LastDrugPage implements OnInit {
  idUser: number;
  idEtab: number;
  token: string;
  resultName: string;
  idDossier: number;
  idCr: number;
  resultId: number;
  stepId: number;
  dataPatients: Array<DossierModel>;
  hasHistoric = false;
  dataPatient: DossierModel;
  ecgTmp: string;
  isLoading = false;
  isCloture: boolean;
  returnClotureDossier: ClotureModel;

  ecgImage = "/assets/images/ecg.jpg";
  patientFullName: string;

  constructor(
    private srvApp: ServiceAppService,
    private sglob: GlobalvarsService,
    private formBuilder: FormBuilder,
    private activatedroute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
    private modalCtrl: ModalController
  ) {}

  get plavix() {
    // console.log("PLAVIX :::", this.drugForm.get('plavix'));
    return this.drugForm.get("plavix");
  }
  drugForm = this.formBuilder.group({
    plavix: [false, [Validators.pattern]]
  });
  // public errorMessages = {
  //   plavix: [{ type: 'pattern', message: 'Veuillez confirmer l\'administration du médicament' }]
  // };

  ngOnInit() {
    this.idUser = this.sglob.getIdUser();
    this.idEtab = this.sglob.getidEtab();
    this.token = this.sglob.getToken();
    this.isCloture = false;

    this.activatedroute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("dataPatientObj")) {
        this.router.navigate(["/home"]);
      } else {
        const dataObj = paramMap.get("dataPatientObj");
        this.dataPatient = JSON.parse(dataObj);
        this.idDossier = this.dataPatient.dossierId;
        this.resultId = this.dataPatient.resultId;
        this.stepId = this.dataPatient.stepId;
        this.idCr = this.dataPatient.lastCrId;
        this.resultName = this.dataPatient.resultName;
        console.log(" plavix stepId ::: ", this.stepId);
        if (this.stepId !== 16) {
          this.srvApp.stepUpdatePage(
            this.idDossier,
            16,
            this.resultId,
            this.token,
            20
          );
        }

        this.patientFullName =
          this.dataPatient.lastName + " " + this.dataPatient.firstName;

        //this.objectInsc = JSON.parse(dataObj);
        console.log(" DIAGNOSTIC >>>>> dataPatients ::: ", this.dataPatient);
      }
    });
  }

  // changeToggle(event) {
  //   console.log(event);

  //   // if (!this.flag) {
  //   //   event.stopImmediatePropagation();
  //   //   event.stopPropagation();
  //   //   event.preventDefault();

  //   //   this.flag = true;

  //   // }
  // }

  // submitForm() {
  //   console.log(this.plavix.value);

  //   if (this.plavix.value) {
  //     console.log('Opération réussit, dossier en cours de Clôture');
  //     this.clotureDossier();
  //   } else {
  //     this.sglob.showAlert("Erreur ", "Veuiller confirmer la fourniture du médicament au patient");
  //   }
  // }

  clotureDossier() {
    this.isLoading = true;

    this.loadingCtrl
      .create({ keyboardClose: true, message: "Clôture en cours..." })
      .then(loadingEl => {
        loadingEl.present();
        const params = {
          dossierId: this.idDossier,
          resultatId: this.resultId,
          plavix: "1",
          crId: this.idCr,
          angio: "1",
          doctorId: this.idUser
        };

        console.log(" params ", params);
        const authObs: Observable<ClotureResponseData> = this.srvApp.clotureDossier(
          params,
          this.token
        );
        authObs.subscribe(
          resData => {
            this.isLoading = false;
            this.returnClotureDossier = resData.data;
            loadingEl.dismiss();
            if (+resData.code === 201) {
              this.sglob.updateInitFetchHome(true);
              console.log(" diag getInitFetch ", this.sglob.getInitFetch());

              const message =
                "Le dossier du patient " +
                this.patientFullName +
                " a été clôturé avec succès";
              this.sglob.presentToast(message);

              // --------- Back to home ------------------
              this.router.navigate(["/home"]);

              //this.isCloture = true;
            } else {
              // ----- Hide loader ------
              loadingEl.dismiss();
              this.sglob.showAlert("Erreur ", "Problème interne !!!");
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
                "Problème d'accès au réseau, veillez vérifier votre connexion"
              );
            }
          }
        );
      });
  }
}
