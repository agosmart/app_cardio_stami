import { Component, OnInit } from "@angular/core";
import { ServiceAppService } from "src/app/services/service-app.service";
import { GlobalvarsService } from "src/app/services/globalvars.service";
import { ActivatedRoute, Router } from "@angular/router";
import {
  LoadingController,
  AlertController,
  ModalController,
  NavParams
} from "@ionic/angular";
import { EtabResponseData } from "src/app/models/etab.response";
import { ListeMedByCRModel } from "src/app/models/listeMedByCr.model";
import { Observable } from "rxjs";
import { DemandeAvisResponseData } from "src/app/models/DemandeAvis.response";
import { ReponseAvisResponseData } from "src/app/models/reponseAvis.response";
import { ReponseAvisModel } from "src/app/models/reponseAvis.model";
import { DossierModel } from "src/app/models/dossier.model";
import { StPageRoutingModule } from "src/app/cloture/st/st-routing.module";

@Component({
  selector: "app-list-cr",
  templateUrl: "./list-cr.page.html",
  styleUrls: ["./list-cr.page.scss"]
})
export class ListCrPage implements OnInit {
  idCr = 0;
  idUser: number;
  idEtab: number;
  dossierId: number;
  idMotif: number;
  token: string;
  itemsCR: any;
  etabName: string;
  dataPatient: DossierModel;
  avisMotif: string;
  constructor(
    private srvApp: ServiceAppService,
    private sglob: GlobalvarsService,
    private activatedroute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private router: Router,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) {}

  ngOnInit() {
    this.idUser = this.navParams.data.idUser;
    this.idEtab = this.navParams.data.idEtab;
    this.dossierId = this.navParams.data.dossierId;
    this.idMotif = this.navParams.data.idMotif;
    switch (this.idMotif) {
      case 1:
        this.avisMotif = "DEMANDER UN AVIS MEDICAL ST ou RAS";
        break;
      case 2:
        this.avisMotif = "DEMANDER UN AVIS MEDICAL THROMBOLYSE";
        break;
      case 3:
        this.avisMotif = "DEMANDER UN AVIS MEDICAL RECEPTION POUR ENGIOPLASTIE";
        break;
      case 4:
        this.avisMotif = "DEMANDER UN AVIS MEDICAL RECEPTION CI ABSOLU";
        break;
      case 5:
        this.avisMotif = "DEMANDER UN AVIS MEDICAL RECEPTION CI RELATIVE";
        break;
      default:
        this.avisMotif =
          "DEMANDER UN AVIS MEDICAL RECEPTION APRES THROMOBOLYSE";
    }

    this.token = this.navParams.data.token;

    console.log("token", this.token);

    console.log(this.dossierId);

    this.onGetlistCr();
  }

  onGetlistCr() {
    this.loadingCtrl
      .create({ keyboardClose: true, message: "Opération  en cours..." })
      .then(loadingEl => {
        loadingEl.present();
        const authObs: Observable<EtabResponseData> = this.srvApp.getListeCRTime(
          this.idEtab,
          this.token
        );
        // ---- Call getListeCR function
        authObs.subscribe(
          // :::::::::::: ON RESULT ::::::::::
          resData => {
            loadingEl.dismiss();
            if (+resData.code === 200) {
              this.itemsCR = resData.data;
              console.log("List Etab CR :", this.itemsCR);
              // ---------- DEMO DURATION ----------
              // this.itemsCR.map(
              //   (m: { duration: string }) => (m.duration = "00:35:00")
              // );
            } else {
              this.sglob.showAlert("Erreur ", resData.message);
            }
          },
          errRes => {
            console.log("errRes :::>", errRes);
            // ----- Hide loader ------
            loadingEl.dismiss();
            // --------- Show Alert --------
            if (errRes.error.errors != null) {
              this.sglob.showAlert("Erreur ", errRes.error.errors.email);
            } else {
              this.sglob.showAlert(
                "Erreur !",
                "Prblème d'accès au réseau, veillez vérifier votre connexion"
              );
            }
          }
        );
      });
  }

  toggleSelectionCr(idCr: number, etabName: string, index: number) {
    console.log("idrc ====> ", idCr);
    console.log("index ====> ", index);
    this.etabName = etabName;
    //this.idCr = idCr;
    //this.dataPatient.lastCrId = idCr;

    // # ====== Add color to selected CR item ==========
    this.itemsCR[index].open = !this.itemsCR[index].open;
    if (this.itemsCR && this.itemsCR[index].open) {
      this.itemsCR
        .filter((item: any, itemIndex: any) => itemIndex !== index)
        .map((item: any) => {
          item.open = false;
        });
    }
  }

  demandeAvisCr(idCr: number, etabName: string, index: number) {
    this.toggleSelectionCr(idCr, etabName, index);
    this.loadingCtrl
      .create({ keyboardClose: true, message: "Opération  en cours..." })
      .then(loadingEl => {
        loadingEl.present();

        const params = {
          doctorId: this.idUser,
          cudtId: this.idEtab,
          crId: idCr,
          dossierId: this.dossierId,
          motifId: this.idMotif
        };
        // ---- Call demandeAvis API
        const authObs: Observable<DemandeAvisResponseData> = this.srvApp.demandeAvis(
          params,
          this.token
        );
        authObs.subscribe(
          // :::::::::::: ON RESULT ::::::::::
          resData => {
            // ----- Hide loader ------
            loadingEl.dismiss();
            console.log("resData ==>", resData.data);
            console.log("resData demandeId ==>", resData.data.demandeId);

            if (+resData.code === 201) {
              // ------------------------------------------
              // this.dataPatient["LastDemandeAvisId"] = resData.data.demandeId;
              this.idCr = idCr;
              this.sglob.presentToast(
                "la demande avis médical vers a été envoyé au CR " +
                  this.etabName
              );
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
                "Vous avez déjà envoyé une demande à ce centre"
              );
            }
          }
        );
      });
  }

  closeModal() {
    console.log("this.idCr", this.idCr);
    this.modalCtrl.dismiss(this.idCr);
  }
  dismissModal() {
    console.log("this.idCr", this.idCr);
    this.modalCtrl.dismiss(this.idCr);
  }
  //dismissModal;
}
