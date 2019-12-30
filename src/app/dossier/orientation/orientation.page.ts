import { Component, OnInit } from "@angular/core";
import { ServiceAppService } from "src/app/services/service-app.service";
import { GlobalvarsService } from "src/app/services/globalvars.service";
import { ActivatedRoute, Router } from "@angular/router";
import {
  LoadingController,
  AlertController,
  ModalController
} from "@ionic/angular";
import { EtabResponseData } from "src/app/models/etab.response";
import { ListeMedByCRResponseData } from "src/app/models/listeMedByCr.response";
import { ListeMedByCRModel } from "src/app/models/listeMedByCr.model";
import { Observable } from "rxjs";
import { DemandeAvisResponseData } from "src/app/models/DemandeAvis.response";
import { ReponseAvisResponseData } from "src/app/models/reponseAvis.response";
import { ReponseAvisModel } from "src/app/models/reponseAvis.model";

@Component({
  selector: "app-orientation",
  templateUrl: "./orientation.page.html",
  styleUrls: ["./orientation.page.scss"]
})
export class OrientationPage implements OnInit {
  idUser: number;
  idEtab: number;
  dossierId: number;
  token: string;
  itemsCR: any;
  itemsMeds: ListeMedByCRModel;
  dataReponsesAvis: ReponseAvisModel;
  isLoading = false;
  afficheMed = false;
  demandeAvisId = 0;
  etabName = "abc";
  dataPatient: object;
  retunListeCR: EtabResponseData;

  constructor(
    private srvApp: ServiceAppService,
    private sglob: GlobalvarsService,
    private activatedroute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.idUser = this.sglob.getIdUser();
    this.idEtab = this.sglob.getidEtab();
    this.token = this.sglob.getToken();
    this.activatedroute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("dataPatientObj")) {
        this.router.navigate(["/home"]);
      } else {
        const dataObj = paramMap.get("dataPatientObj");
        this.dataPatient = JSON.parse(dataObj);
        this.dossierId = this.dataPatient["dossierId"];
        //this.objectInsc = JSON.parse(dataObj);
        this.demandeAvisId = this.dataPatient["demandeAvisId"];
        console.log(" orientation  >>>>> dataPatients ::: ", this.dataPatient);
        console.log(
          " orientation >>>>> demandeAvisId ::: ",
          this.demandeAvisId
        );
        if (this.demandeAvisId > 0) {
          this.afficheMed = true;
          this.reponseAvisCR(this.demandeAvisId);
        } else {
          this.listeCr();
        }
      }
      // 1 c les CR  2 CUDT
    });
  }

  listeCr() {
    this.srvApp.getListeCR(1).subscribe((resp: any) => {
      this.retunListeCR = resp;
      console.log("return liste cr", this.retunListeCR);
      console.log("return liste code", this.retunListeCR.code);
      // this.retunListeCR.code = 200; // a enlever
      if (+this.retunListeCR.code === 200) {
        this.itemsCR = this.retunListeCR.data;
        console.log("nom etab cr", this.retunListeCR.data);

        // ---------- DEMO DURATION ----------
        this.itemsCR[0]['duration'] = '00:25:00';
        this.itemsCR[1]['duration'] = '03:25:00';
        //--------------------------------------
      } else {
        console.log("no");
      }
    });
  }

  demandeAvisCr(idCr) {
    console.log("demandeAvisCr idrc ", idCr);
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: "opération  en cours..." })
      .then(loadingEl => {
        loadingEl.present();

        const params = {
          doctorId: this.idUser,
          cudtId: this.idEtab,
          crId: idCr,
          dossierId: this.dossierId,
          motifId: 1
        };

        const authObs: Observable<DemandeAvisResponseData> = this.srvApp.demandeAvis(
          params,
          this.token
        );
        // ---- Call Login function
        authObs.subscribe(
          // :::::::::::: ON RESULT ::::::::::
          resData => {
            this.isLoading = false;
            // ----- Hide loader ------
            loadingEl.dismiss();

            if (+resData.code === 201) {
              // this.etabName = this.itemsMeds[0]["etabName"];
              this.afficheMed = true;
              console.log(" resData", resData.data);
              console.log(" resData demandeId", resData.data.demandeId);
              this.demandeAvisId = resData.data.demandeId;
              this.reponseAvisCR(this.demandeAvisId);
              //this.sglob.presentToast(resData.message);
              // ----- Redirection to Home page ------------
            } else {
              // --------- Show Alert --------
              this.showAlert(resData.message);
            }
          },

          // ::::::::::::  ON ERROR ::::::::::::
          errRes => {
            console.log(errRes);
            // ----- Hide loader ------
            loadingEl.dismiss();
            // --------- Show Alert --------
            if (errRes.error.errors != null) {
              this.showAlert(errRes.error.errors.email);
            } else {
              this.showAlert(
                "Prblème d'accès au réseau, veillez vérifier votre connexion"
              );
            }
          }
        );
      });
  }

  reponseAvisCR(demandeAvisId) {
    console.log("******************reponseAvis cr **", demandeAvisId);
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: "opération  en cours..." })
      .then(loadingEl => {
        loadingEl.present();

        const authObs: Observable<ReponseAvisResponseData> = this.srvApp.reponseDemandeAvis(
          demandeAvisId,
          this.token
        );
        // ---- Call Login function
        authObs.subscribe(
          // :::::::::::: ON RESULT ::::::::::
          resData => {
            this.isLoading = false;
            // const dataResponse: UserModel = JSON.stringify(resData.data);
            // ----- Hide loader ------
            loadingEl.dismiss();

            if (+resData.code === 200) {
              // ----- Toast ------------
              this.dataReponsesAvis = resData.data;
              console.log("Response >>>>> ", this.dataReponsesAvis);
              console.log(
                "Response >>>>> ",
                this.dataReponsesAvis[0]["medecin"]
              );
              //this.etabName = this.itemsMeds[0]["etabName"];
              this.afficheMed = true;
              //this.sglob.presentToast(resData.message);
              // ----- Redirection to Home page ------------
            } else {
              // --------- Show Alert --------
              this.showAlert(resData.message);
            }
          },

          // ::::::::::::  ON ERROR ::::::::::::
          errRes => {
            console.log(errRes);
            // ----- Hide loader ------
            loadingEl.dismiss();
            // --------- Show Alert --------
            if (errRes.error.errors != null) {
              this.showAlert(errRes.error.errors.email);
            } else {
              this.showAlert(
                "Prblème d'accès au réseau, veillez vérifier votre connexion"
              );
            }
          }
        );
      });
  }

  decision() {
    console.log("orientation vers datapatient diag ===>", this.dataPatient);
    this.router.navigate([
      "./diagnostic",
      this.dossierId,
      JSON.stringify(this.dataPatient)
    ]);
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
