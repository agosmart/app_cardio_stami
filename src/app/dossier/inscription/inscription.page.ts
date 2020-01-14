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
  idPatient = 0;
  dataPatientObj: PatientModel;
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
    return this.inscriptionDossier.get("nom");
  }
  get prenom() {
    return this.inscriptionDossier.get("prenom");
  }
  get genre() {
    return this.inscriptionDossier.get("genre");
  }
  get dateNaissance() {
    return this.inscriptionDossier.get("dateNaissance");
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
  inscriptionDossier = this.formBuilder.group({
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
    console.log(this.inscriptionDossier.value.dateNaissance);
    // ------ Api service login ---------------
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: "recherche  en cours..." })
      .then(loadingEl => {
        loadingEl.present();

        // res = str.toLowerCase();
        const params = {
          lastName: this.inscriptionDossier.value.nom,
          firstName: this.inscriptionDossier.value.prenom,
          gender: this.inscriptionDossier.value.genre,
          birthDay: this.inscriptionDossier.value.dateNaissance.substr(0, 10)
        };

        console.log("paramls===>", params);
        console.log(
          "DATA NAISSANCE >>>>> ",
          this.inscriptionDossier.value.dateNaissance.substr(0, 10)
        );
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

            console.log("resData >>>>> ", resData);
            // ----- Hide loader ------
            loadingEl.dismiss();

            if (resData.data.length > 0) {
              console.log("code  >>>>> ", +resData.code);
              this.isPatient = true;
            } else {
              // ----- Hide loader ------
              loadingEl.dismiss();

              this.goToEcgInfos(
                this.inscriptionDossier.value.nom,
                this.inscriptionDossier.value.prenom,
                this.inscriptionDossier.value.dateNaissance,
                this.inscriptionDossier.value.genre,
                this.idPatient
              );
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

  goToEcgInfos(nom, prenom, dateNaissance, genre, idPatient) {
    this.dataPatientObj = {
      firstName: prenom,
      lastName: nom,
      birthDay: dateNaissance,
      gender: genre,
      patientId: idPatient
    };
    this.inscriptionDossier.reset();
    this.router.navigate(["./insc-ecg", JSON.stringify(this.dataPatientObj)]);
  }
}
