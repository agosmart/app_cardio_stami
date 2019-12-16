import { Component, OnInit } from "@angular/core";
import { GlobalvarsService } from "../../services/globalvars.service";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { LoadingService } from "src/app/services/loading.service";
import { ServiceAppService } from "src/app/services/service-app.service";
import { PatientResponseData } from "../../models/patient.response";
//import {PatientModel} from '../../models'
import {
  NavController,
  LoadingController,
  AlertController
} from "@ionic/angular";
import { PatientModel } from "../../models/patient.model";
import { Router, RouterModule, NavigationExtras } from "@angular/router";
import { Observable } from "rxjs";
@Component({
  selector: "app-inscription",
  templateUrl: "./inscription.page.html",
  styleUrls: ["./inscription.page.scss"]
})
export class InscriptionPage implements OnInit {
  IdUser: number;
  idEtab: number;
  token: string;
  idPatient;
  objetInsc: any;
  listePatientExist: any;
  isPatient: boolean;
  existFirstName: string;
  existLastName: string;
  existIdPatient: number;
  existDateNaissance: string;
  isLoading = false;
  returnSearchPatient: Array<PatientModel>;

  constructor(
    private sglob: GlobalvarsService,
    private formBuilder: FormBuilder,
    public loading: LoadingService,
    private srv: ServiceAppService,
    public navcrtl: NavController,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    this.isPatient = false;
    this.IdUser = this.sglob.getIdUser();
    this.idEtab = this.sglob.getidEtab();
    this.token = this.sglob.getToken();

    console.log("token inscription===>", this.token);
  }

  get nom() {
    return this.insciptionDossier.get("nom");
  }
  get prenom() {
    return this.insciptionDossier.get("prenom");
  }
  get genre() {
    return this.insciptionDossier.get("genre");
  }
  get dateNaissance() {
    return this.insciptionDossier.get("dateNaissance");
  }
  public errorMessages = {
    nom: [
      { type: "required", message: "Le nom d'utilisateur est requis." },
      {
        type: "maxlength",
        message: "Votre saisie ne doit pas dépasser 50 caractères."
      },
      {
        type: "minLength",
        message: "Votre saisie doit comporter au moins 3 caractères."
      },
      {
        type: "pattern",
        message:
          "Votre saisie doit comporter uniquement des caractères alphabitéque."
      }
    ],
    prenom: [
      { type: "required", message: "Le prénom est requis." },
      {
        type: "maxlength",
        message: "Votre saisie ne doit pas dépasser 50 caractères."
      },
      {
        type: "minLength",
        message: "Votre saisie doit comporter au moins 3 caractères."
      },
      {
        type: "pattern",
        message:
          "Votre saisie doit comporter uniquement des caractères alphabitéque"
      }
    ],
    genre: [{ type: "required", message: "" }],
    dateNaissance: [
      { type: "required", message: "La date de naissance est requise." }
    ]
  };
  insciptionDossier = this.formBuilder.group({
    nom: [
      "",
      [
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(3),
        Validators.pattern("^[a-zA-ZÀÂÉÊÈËÌÏÎÔÙÛÇÆŒàâéêèëìïîôùûçæœ '-]+$")
      ]
    ],
    prenom: [
      "",
      [
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(3),
        Validators.pattern("^[a-zA-ZÀÂÉÊÈËÌÏÎÔÙÛÇÆŒàâéêèëìïîôùûçæœ '-]+$")
      ]
    ],
    genre: ["", [Validators.required]],
    dateNaissance: ["", [Validators.required]]
  });

  ngOnInit() {
    // this.returnSearchPatient = [{
    //   id: 8,
    //   nom: "Mamadou",
    //   prenom: "Touré",
    //   gender: 2,
    //   birthday: "1960-02-15",
    //   qrcode: "998877665544332211",
    //   cudt: "hai El-badre",
    // },
    // {
    //   id: 50,
    //   nom: "Mamadou",
    //   prenom: "Touré",
    //   gender: 2,
    //   birthday: "1960-02-15",
    //   qrcode: null,
    //   cudt: "Rouiba",
    // }];
  }
  submitform() {
    // ------ Api service login ---------------
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: "recherche  en cours..." })
      .then(loadingEl => {
        loadingEl.present();

        const params = {
          nom: this.insciptionDossier.value.nom,
          prenom: this.insciptionDossier.value.prenom,
          genre: this.insciptionDossier.value.genre,
          dateNaissance: this.insciptionDossier.value.dateNaissance
        };
        console.log("paramls===>", params);
        const authObs: Observable<PatientResponseData> = this.srv.getPatient(
          params,
          this.token
        );
        // ---- Call Login function
        authObs.subscribe(
          // :::::::::::: ON RESULT ::::::::::
          resData => {
            this.isLoading = false;
            // const dataResponse: UserModel = JSON.stringify(resData.data);
            this.returnSearchPatient = resData.data;

            console.log("status >>>>> ", resData);
            console.log("resData >>>>> ", resData);
            // ----- Hide loader ------
            loadingEl.dismiss();

            if (+resData.data.length > 0) {
              console.log("code  >>>>> ", +resData.code);
              this.isPatient = true;
            } else {
              this.idPatient = 0;
              this.goToEcgInfos(
                this.insciptionDossier.value.nom,
                this.insciptionDossier.value.prenom,
                this.insciptionDossier.value.dateNaissance,
                this.insciptionDossier.value.genre,
                this.idPatient
              );
              // --------- Show Alert --------
              //this.showAlert("resData.code");
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

  // _submitform1() {
  //   this.loading.showLoader("Recherche en cours...");
  //   console.log(this.insciptionDossier.value);
  //   this.srv
  //     .getPatient(this.insciptionDossier.value, this.token)
  //     .then(newsFetched => {
  //       this.returnSearchPatient = newsFetched;
  //       console.log("return inscription", this.returnSearchPatient);

  //       if (this.returnSearchPatient.code === 201) {
  //         this.loading.hideLoader();
  //         this.goToEcgInfos(
  //           this.insciptionDossier.value.nom,
  //           this.insciptionDossier.value.prenom,
  //           this.insciptionDossier.value.dateNaissance,
  //           0
  //         );
  //         this.sglob.presentToast(
  //           "Le patient vient d'étre enregistrer dans le système."
  //         );
  //       } else {
  //         this.loading.hideLoader();
  //         this.isPatient = true;
  //         console.log("existe---***", this.returnSearchPatient.items);
  //         this.listePatientExist = this.returnSearchPatient.items;
  //         this.sglob.presentToast(
  //           "le patient existe déja dans le système, veuillez en séléctionner un de la lsite ci-dessous."
  //         );
  //       }
  //     });
  // }

  goToEcgInfos(nom, prenom, dateNaissance, genre, idPatient) {
    this.objetInsc = {
      firstName: prenom,
      lastName: nom,
      birthday: dateNaissance,
      gender: genre,
      idPatient: idPatient
    };

    console.log("objetInsc---***", this.objetInsc);
    this.srv.setExtras(this.objetInsc);
    this.router.navigate(["./insc-ecg"]);
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
