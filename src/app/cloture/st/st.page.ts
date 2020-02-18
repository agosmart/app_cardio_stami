import { Component, OnInit } from "@angular/core";
import { ServiceAppService } from "src/app/services/service-app.service";
import { GlobalvarsService } from "src/app/services/globalvars.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DossierModel } from "src/app/models/dossier.model";
import {
  LoadingController,
  AlertController,
  ModalController
} from "@ionic/angular";
import { Observable } from "rxjs";
import { ClotureResponseData } from "src/app/models/cloture.response";
import { ClotureModel } from "src/app/models/cloture.model";
import { ImagePage } from "src/app/modal/image/image.page";

@Component({
  selector: "app-st",
  templateUrl: "./st.page.html",
  styleUrls: ["./st.page.scss"]
})
export class StPage implements OnInit {
  idUser: number;
  idEtab: number;
  token: string;
  idDossier: number;
  dataPatients: Array<DossierModel>;
  dataPatient: DossierModel;
  hasHistoric = false;
  ecgTmp: string;
  isLoading = false;
  isCloture: boolean;
  returnClotureDossier: ClotureModel;

  urlEcg: string;

  constructor(
    private srvApp: ServiceAppService,
    private sglob: GlobalvarsService,
    private activatedroute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
    private modalCtrl: ModalController
  ) {}

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
        //this.objectInsc = JSON.parse(dataObj);
        console.log(" DIAGNOSTIC >>>>> dataPatients ::: ", this.dataPatient);
        console.log(
          " DIAGNOSTIC >>>>> dataPatients ::: ",
          this.dataPatient["lastName"]
        );
        this.urlEcg = this.dataPatient["ecgImage"];
      }
      if (!paramMap.has("idDossier")) {
        this.router.navigate(["/home"]);
      } else {
        this.idDossier = +paramMap.get("idDossier");
        console.log(" DIAGNOSTIC >>>>> idDossier  halim ::: ", this.idDossier);
        this.ecgTmp = this.dataPatient["ecgTmp"];

        if (this.dataPatient.stepId !== 23) {
          this.srvApp.stepUpdatePage(
            this.idDossier,
            23,
            this.dataPatient.resultId,
            this.token
          );
        }
      }
    });
  }

  clotureDossier() {
    this.isLoading = true;

    this.loadingCtrl
      .create({ keyboardClose: true, message: "Clôture en cours..." })
      .then(loadingEl => {
        loadingEl.present();
        const params = {
          dossierId: this.idDossier,
          resultatId: this.dataPatient["resultId"],
          doctorId: this.dataPatient["doctorId"],
          crId: this.dataPatient["lastCrId"]
        };

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

  async openImageEcg() {
    const modal = await this.modalCtrl.create({
      component: ImagePage,
      componentProps: { value: this.urlEcg }
    });
    return await modal.present();
  }
}
