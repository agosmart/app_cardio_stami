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
  selector: "app-ras",
  templateUrl: "./ras.page.html",
  styleUrls: ["./ras.page.scss"]
})
export class RasPage implements OnInit {
  idUser: number;
  idEtab: number;
  token: string;
  idDossier: number;
  dataPatients: Array<DossierModel>;
  hasHistoric = false;
  dataPatient: DossierModel;
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

    // this.activatedroute.paramMap.subscribe(paramMap => {
    //   if (!paramMap.has("dataPatientObj")) {
    //     this.router.navigate(["/home"]);
    //   } else {
    //     const dataObj = paramMap.get("dataPatientObj");
    //     this.dataPatient = JSON.parse(dataObj);
    //     //this.objectInsc = JSON.parse(dataObj);

    //     this.urlEcg = this.dataPatient["ecgImage"];
    //   }
    //   if (!paramMap.has("idDossier")) {
    //     this.router.navigate(["/home"]);
    //   } else {
    //     this.idDossier = +paramMap.get("idDossier");
    //     if (this.dataPatient.stepId !== 10) {
    //       this.srvApp.stepUpdatePage(this.idDossier, 10, 1, this.token, 1);
    //     }
    //     console.log(" DIAGNOSTIC >>>>> idDossier  halim ::: ", this.idDossier);
    //     this.ecgTmp = this.dataPatient["ecgTmp"];
    //   }
    // });
    this.dataPatient = this.srvApp.getExtras();
    console.log("===== dataPatient get  ===", this.dataPatient);
    if (this.dataPatient) {
      this.idDossier = this.dataPatient["dossierId"];
      this.urlEcg = this.dataPatient["ecgImage"];
      if (this.dataPatient.stepId !== 10) {
        this.srvApp.stepUpdatePage(this.idDossier, 10, 1, this.token, 1);
      }
      this.ecgTmp = this.dataPatient["ecgTmp"];
    } else {
      this.router.navigate(["/home"]);
    }
  }

  clotureDossier() {
    this.isLoading = true;

    this.loadingCtrl
      .create({ keyboardClose: true, message: "Clôture en cours..." })
      .then(loadingEl => {
        loadingEl.present();
        const params = {
          dossierId: this.idDossier,
          resultatId: 1,
          doctorId: this.dataPatient["doctorId"]
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
