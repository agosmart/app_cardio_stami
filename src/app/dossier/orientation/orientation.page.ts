import { Component, OnInit } from '@angular/core';
import { ServiceAppService } from 'src/app/services/service-app.service';
import { GlobalvarsService } from 'src/app/services/globalvars.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { EtabResponseData } from 'src/app/models/etab.response';

import { ListeMedByCRModel } from 'src/app/models/listeMedByCr.model';
import { Observable } from 'rxjs';
import { DemandeAvisResponseData } from 'src/app/models/DemandeAvis.response';
import { ReponseAvisResponseData } from 'src/app/models/reponseAvis.response';
import { ReponseAvisModel } from 'src/app/models/reponseAvis.model';
import { DossierModel } from 'src/app/models/dossier.model';

@Component({
  selector: 'app-orientation',
  templateUrl: './orientation.page.html',
  styleUrls: ['./orientation.page.scss']
})
export class OrientationPage implements OnInit {
  idUser: number;
  idEtab: number;
  dossierId: number;
  token: string;
  etabName: string;
  itemsCR: any;
  idCr: number;
  itemsMeds: ListeMedByCRModel;
  dataReponsesAvis:Array<ReponseAvisModel>;

  reviewsList = 0;
  afficheListeCr = false;
  afficheReponseMed = false;

  demandeAvisId = 0;
  dataPatient: DossierModel;
  retunListeCR: EtabResponseData;

  constructor(
    private srvApp: ServiceAppService,
    private sglob: GlobalvarsService,
    private activatedroute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private router: Router,
  ) { }

  ngOnInit() {
    this.idUser = this.sglob.getIdUser();
    this.idEtab = this.sglob.getidEtab();
    this.token = this.sglob.getToken();
    this.activatedroute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('dataPatientObj')) {
        this.router.navigate(['/home']);
      } else {
        const dataObj = paramMap.get('dataPatientObj');
        this.dataPatient = JSON.parse(dataObj);
        this.dossierId = this.dataPatient.dossierId;
        this.demandeAvisId = this.dataPatient.LastDemandeAvisId;
        const motifId = this.dataPatient.lastMotifId;

        if (this.dataPatient.stepId !== 6) {
          this.srvApp.stepUpdatePage(this.dossierId, 6, 1, this.token);
        }
        if (this.demandeAvisId > 0) {
          this.afficheListeCr = true;
          this.reponseAvisCR(this.demandeAvisId);
        } else {
          // this.listeCr();
          this.onGetlistCr();
        }
      }
    });
  }


  // ---------------------LIST CR------------------------------------------
  onGetlistCr() {

    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Opération  en cours...' })
      .then(loadingEl => {
        loadingEl.present();

        // 1 = CR / 2 = CUDT

        const authObs: Observable<EtabResponseData> = this.srvApp.getListeCR(1);
        // ---- Call getListeCR function
        authObs.subscribe(
          // :::::::::::: ON RESULT ::::::::::
          resData => {
            loadingEl.dismiss();
            if (+resData.code === 200) {
              this.itemsCR = resData.data;
              console.log('List Etab CR :', this.itemsCR);
              // ---------- DEMO DURATION ----------
              this.itemsCR.map((m: { duration: string; }) => m.duration = '00:35:00');
              // --------------------------------------

              // --------------DISPLAY CR LIST------------------------
              this.afficheListeCr = true;
              console.group('==== DATA onGetlistCr ====');
              console.log('this.afficheListeCr ::::', this.afficheListeCr);
              console.log(' this.afficheReponseMed ::::', this.afficheReponseMed);
              console.log(' this.reviewsList ::::', this.reviewsList);
              console.groupEnd();

            } else {
              this.sglob.showAlert('Erreur ', resData.message);
            }

          },
          errRes => {
            console.log('errRes :::>', errRes);
            // ----- Hide loader ------
            loadingEl.dismiss();
            // --------- Show Alert --------
            if (errRes.error.errors != null) {
              this.sglob.showAlert('Erreur ', errRes.error.errors.email);
            } else {
              this.sglob.showAlert(
                'Erreur !', 'Prblème d\'accès au réseau, veillez vérifier votre connexion'
              );
            }
          });
      });
  }

  // ---------------------------------------------------------------

  toggleSelectionCr(idCr: number, etabName: string, index: number) {
    console.log('idrc ====> ', idCr);
    console.log('index ====> ', index);
    this.etabName = etabName;
    this.idCr = idCr;

    // # ====== Add color to selected CR item ==========
    this.itemsCR[index].open = !this.itemsCR[index].open;
    if (this.itemsCR && this.itemsCR[index].open) {
      this.itemsCR
        .filter((item: any, itemIndex: any) => itemIndex !== index)
        .map((item: any) => { item.open = false; });
    }
  }


  demandeAvisCr(idCr: number, etabName: string, index: number) {

    // console.log('afficheListeCr +++++++ ', this.afficheListeCr);
    // # ====== Add color to selected CR item ==========
    this.toggleSelectionCr(idCr, etabName, index);
    // -------------------------------------------
    console.log('demandeAvisCr idrc ===== ', idCr);

    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Opération  en cours...' })
      .then(loadingEl => {
        loadingEl.present();

        const params = {
          doctorId: this.idUser,
          cudtId: this.idEtab,
          crId: idCr,
          dossierId: this.dossierId,
          motifId: 1
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

            if (+resData.code === 201) {

              // ------------ DISPLAY BLOC  LIST CR -------------------

              this.afficheListeCr = false;
              this.afficheReponseMed = true;
              console.group('==== DATA demandeAvisCr ====');
              console.log('this.afficheListeCr ::::', this.afficheListeCr);
              console.log(' this.afficheReponseMed ::::', this.afficheReponseMed);
              console.log(' this.reviewsList ::::', this.reviewsList);
              console.groupEnd();
              // ------------------------------------------
              /*
               console.log(' resData ==== ', resData.data);
               console.log(' resData demandeId ===', resData.data.demandeId);
              */
              this.demandeAvisId = resData.data.demandeId;

              // this.reponseAvisCR(this.demandeAvisId);
             //  getListDoctorCr(idCr)

            } else {
              this.sglob.showAlert('Erreur ', resData.message);
            }
          },

          // ::::::::::::  ON ERROR ::::::::::::
          errRes => {
            console.log(errRes);
            // ----- Hide loader ------
            loadingEl.dismiss();
            // --------- Show Alert --------
            if (errRes.error.errors != null) {
              this.sglob.showAlert('Erreur ', errRes.error.errors.email);
            } else {
              this.sglob.showAlert(
                'Erreur ',
                'Prblème d\'accès au réseau, veillez vérifier votre connexion'
              );
            }
          }
        );
      });
  }

  reponseAvisCR(demandeAvisId: number) {

    console.log('*****reponseAvis cr ******', demandeAvisId);

    this.loadingCtrl
      .create({ keyboardClose: true, message: 'opération  en cours...' })
      .then(loadingEl => {
        loadingEl.present();
        // ---- Call reponseDemandeAvis API
        const authObs: Observable<ReponseAvisResponseData> = this.srvApp.reponseDemandeAvis(
          demandeAvisId,
          this.token
        );
        authObs.subscribe(
          // :::::::::::: ON RESULT ::::::::::
          resData => {
            // ----- Hide loader ------
            loadingEl.dismiss();

            if (+resData.code === 200) {
              this.dataReponsesAvis = resData.data;

              console.log("this.dataReponsesAvis === " ,this.dataReponsesAvis );

              // ------- HIDE CR LIST / SHOW DOCTORS REVIEWS LIST-------
              this.afficheListeCr = false;
              this.afficheReponseMed = true;
              this.reviewsList = this.dataReponsesAvis.length;

              console.group('==== DATA reponseAvisCR ====');
              console.log('this.afficheListeCr ::::', this.afficheListeCr);
              console.log(' this.afficheReponseMed ::::', this.afficheReponseMed);
              console.log(' this.reviewsList ::::', this.reviewsList);
              console.groupEnd();

              // ------------------------------------------

            } else {
              this.sglob.showAlert('Erreur ', resData.message);
            }
          },
          // ::::::::::::  ON ERROR ::::::::::::
          errRes => {
            console.log(errRes);
            // ----- Hide loader ------
            loadingEl.dismiss();
            // --------- Show Alert --------
            if (errRes.error.errors != null) {
              this.sglob.showAlert('Erreur ', errRes.error.errors.email);
            } else {
              this.sglob.showAlert(
                'Erreur ',
                'Prblème d\'accès au réseau, veillez vérifier votre connexion'
              );
            }
          }
        );
      });
  }


/*
  getListDoctorCr(idCr: number) {

    // http://cardio.cooffa.shop/api/etablissements/1/medecins
    console.log('*****getListDoctorCr ID CR = ******', idCr);

    this.loadingCtrl
      .create({ keyboardClose: true, message: 'opération  en cours...' })
      .then(loadingEl => {
        loadingEl.present();
        // ---- Call reponseDemandeAvis API
        const authObs: Observable<ListeMedByCRResponseData> = this.srvApp.listeMedByCr(
          idCr,
          this.token
        );
        authObs.subscribe(
          // :::::::::::: ON RESULT ::::::::::
          resData => {
            // ----- Hide loader ------
            loadingEl.dismiss();

            if (+resData.code === 200) {
              this.dataReponsesMedCr = resData.data;
              // ------------------------------------------
            } else {
              loadingEl.dismiss();
              this.sglob.showAlert('Erreur ', resData.message);
            }
          },
          // ::::::::::::  ON ERROR ::::::::::::
          errRes => {
            console.log(errRes);
            // ----- Hide loader ------
            loadingEl.dismiss();
            // --------- Show Alert --------
            if (errRes.error.errors != null) {
              this.sglob.showAlert('Erreur ', errRes.error.errors.email);
            } else {
              this.sglob.showAlert(
                'Erreur ',
                'Prblème d\'accès au réseau, veillez vérifier votre connexion'
              );
            }
          }
        );
      });
  }
*/
  decision() {
    console.log('orientation vers datapatient diag ===>', this.dataPatient);
    this.router.navigate([
      './diagnostic',
      this.dossierId,
      JSON.stringify(this.dataPatient)
    ]);
  }
}
