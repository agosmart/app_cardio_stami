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
import { DossierResponseData } from "src/app/models/dossier.response";
import { DossierModel } from "src/app/models/dossier.model";

@Component({
  selector: "app-thromb-ecg",
  templateUrl: "./thromb-ecg.page.html",
  styleUrls: ["./thromb-ecg.page.scss"]
})
export class ThrombEcgPage implements OnInit {
  idUser: number;
  token: string;
  dossierId: number;
  typeId: number;
  doctorId: number;
  //dataPatient: object;
  dataPatient: DossierModel;
  constructor(
    private formBuilder: FormBuilder,
    private srvApp: ServiceAppService,
    private sglob: GlobalvarsService,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
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
        this.doctorId = this.dataPatient["doctorId"];
        this.dossierId = this.dataPatient["dossierId"];
        if (this.dataPatient["stepId"] !== 14) {
          this.updateStep();
        }
      }
    });
  }

  updateStep() {
    console.log("update step");
    const params = {
      dossierId: this.dossierId,
      //resultatId: this.resultatId,
      stepId: 14
    };

    const authObs: Observable<DossierResponseData> = this.srvApp.updateStep(
      params,
      this.token
    );
    authObs.subscribe(
      resData => {
        if (+resData.code === 200) {
        } else {
          // ----- Hide loader ------
        }
      },

      // ::::::::::::  ON ERROR ::::::::::::
      errRes => {
        console.log(errRes);
        // ----- Hide loader ------
        // --------- Show Alert --------

        if (errRes.error.code === "401") {
          this.showAlert(errRes.error.message);
        } else {
          this.showAlert(
            "Prblème d'accès au réseau, veillez vérifier votre connexion"
          );
        }
      }
    );
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
