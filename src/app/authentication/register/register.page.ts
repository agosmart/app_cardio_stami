import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ServiceAppService } from "src/app/services/service-app.service";
import { LoadingService } from "src/app/services/loading.service";

import { LoadingController, AlertController } from "@ionic/angular";
import { GlobalvarsService } from "src/app/services/globalvars.service";
import { Router } from "@angular/router";

import { Observable } from "rxjs";
import { UserModel } from "src/app/models/user.model";
import { AuthResponseData } from "src/app/models/auth.response";
import { EtabResponseData } from "src/app/models/etab.response";
@Component({
  selector: "app-register",
  templateUrl: "./register.page.html",
  styleUrls: ["./register.page.scss"]
})
export class RegisterPage implements OnInit {
  ChoixCR = 0;
  itemsCR: any;
  itemsCudt: any;
  retunListeCR: EtabResponseData;
  retunListeCUDT: EtabResponseData;
  returnInscription: UserModel;
  passwordMatch = true;

  registrationForm: FormGroup;
  genders: Array<string>;

  dataReturnService: any;

  isLoading = false;
  isLogin = true;

  constructor(
    public loading: LoadingService,
    private formBuilder: FormBuilder,
    private srv: ServiceAppService,
    public router: Router,
    private sglob: GlobalvarsService,

    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    //1 c les CR  2 CUDT
    this.srv.getListeCR(1).subscribe((resp: any) => {
      this.retunListeCR = resp;
      console.log("return liste cr", this.retunListeCR);
      console.log("return liste code", this.retunListeCR.code);
      // this.retunListeCR.code = 200; // a enlever
      if (+this.retunListeCR.code === 200) {
        this.itemsCR = this.retunListeCR.data;
        console.log("nom etab cr", this.retunListeCR.data);
      } else {
        console.log("no");
      }
    });
  }

  get lastName() {
    return this.registrationForm.get("lastName");
  }
  get firstName() {
    return this.registrationForm.get("firstName");
  }
  get mobile() {
    return this.registrationForm.get("mobile");
  }
  get email() {
    return this.registrationForm.get("email");
  }
  get password() {
    return this.registrationForm.get("password");
  }
  get password_confirmation() {
    return this.registrationForm.get("password_confirmation");
  }
  get gender() {
    return this.registrationForm.get("gender");
  }
  get cr() {
    return this.registrationForm.get("cr");
  }
  get cudtId() {
    return this.registrationForm.get("cudtId");
  }
  get terms() {
    return this.registrationForm.get("terms");
  }

  errorMessages = {
    lastName: [
      { type: "required", message: "le nom est requis" },
      { type: "minLength", message: "3 caractères au min" },
      { type: "maxlength", message: "50 caractères au max" },
      { type: "pattern", message: "caractères alphabitéque seulement " }
    ],
    firstName: [
      { type: "required", message: "le prénom est requis" },
      { type: "minLength", message: "3 caractères au min" },
      { type: "maxlength", message: "50 caractères au max" },
      { type: "pattern", message: "caractères alphabitéque seulement" }
    ],
    mobile: [
      { type: "required", message: "le numéro de téléphone est requis" },
      { type: "pattern", message: "le numéro n`est pas valide" }
    ],
    email: [
      { type: "required", message: "le nom d'utilisateur est requis" },
      { type: "maxlength", message: "50 caractères au max" },
      { type: "minLength", message: "3 caractères au min" },
      { type: "pattern", message: "Adresse email non valide" }
    ],
    password: [
      { type: "required", message: "le mot de passe est requis" },
      { type: "minLength", message: "8 caractères au min" },
      { type: "maxlength", message: "50 caractères au max" },
      { type: "pattern", message: "Caractères alphabitéque seulement" }
    ],
    password_confirmation: [
      {
        type: "required",
        message: "la confirmation du mot de passe est requise"
      },
      { type: "minLength", message: "8 caractères au min" },
      { type: "maxlength", message: "50 caractères au max" }
      // { type: 'pattern', message: 'caractères alphabitéque seulement' }
    ],
    gender: [{ type: "required", message: "Votre civilité est requise" }],
    cr: [{ type: "required", message: "Le nom du CR est required" }],
    cudtId: [{ type: "required", message: "Le nom du CUDT est requis" }],
    terms: [
      {
        type: "pattern",
        message: "Vous devez accepter les conditions générales pour continuer"
      }
    ]
  };

  ngOnInit() {
    this.genders = ["Homme", "Femme"];

    this.registrationForm = this.formBuilder.group(
      {
        lastName: [
          "",
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
            Validators.pattern("^[a-zA-ZÀÂÉÊÈËÌÏÎÔÙÛÇÆŒàâéêèëìïîôùûçæœ '-]+$")
          ]
        ],
        firstName: [
          "",
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
            Validators.pattern("^[a-zA-ZÀÂÉÊÈËÌÏÎÔÙÛÇÆŒàâéêèëìïîôùûçæœ '-]+$")
          ]
        ],
        mobile: [
          "",
          [
            Validators.required,
            Validators.pattern("^(00213|213|0)(5|6|7)[0-9]{8}$")
          ]
        ],
        email: [
          "",
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
            Validators.pattern(
              "^[a-z0-9]+(.[_a-z0-9]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,15})$"
            )
          ]
        ],
        password: [
          "",
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(50)

            // Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
          ]
        ],
        password_confirmation: [
          "",
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(50)
          ]
        ],

        gender: [this.genders[0], [Validators.required]],
        cr: ["", [Validators.required]],
        cudtId: ["", [Validators.required]],
        terms: [true, [Validators.pattern("true")]]
      },
      {
        validators: this.matchingPasswords.bind(this)
      }
    );
  }

  //------ service register ---------------
  submitRgister() {
    // const username = this.loginForm.value.username;
    // const password = this.loginForm.value.password;
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: "Inscription en cours..." })
      .then(loadingEl => {
        loadingEl.present();

        const params = this.registrationForm.value;
        console.log("params register : ", params);
        const authObs: Observable<AuthResponseData> = this.srv.registerDoctor(
          params
        );
        let message = "";
        // ---- Call Login function
        authObs.subscribe(
          // :::::::::::: ON RESULT ::::::::::
          resData => {
            this.isLoading = false;
            // const dataResponse: UserModel = JSON.stringify(resData.data);
            const dataResponse: UserModel = resData.data;
            console.log("Response >>>>> ", resData);
            console.log("Response code >>>>> ", resData.code);
            // ----- Hide loader ------
            loadingEl.dismiss();
            if (+resData.code === 201) {
              // ------- Reset Form -------
              //this.registrationForm.reset();
              // ----- Toast ------------
              this.sglob.presentToast(resData.message);
              // ----- Redirection to login page ------------
              this.router.navigate(["./login"]);
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

  OnChangeCR(event: any) {
    this.ChoixCR = 1;
    console.log("cr", this.registrationForm.value.cr);
    this.srv
      .getListeCudtByCR(this.registrationForm.value.cr)
      .subscribe((resp: any) => {
        this.retunListeCUDT = resp;
        //console.log("return liste cr", this.retunListeCR);
        this.retunListeCUDT.code = 200; // a enlever
        if (this.retunListeCUDT.code === 200) {
          this.itemsCudt = this.retunListeCUDT.data;
          console.log("nom etab cudt", this.itemsCudt);
        } else {
          console.log("no");
        }
      });
  }

  matchingPasswords(formGroup: FormGroup) {
    const password = formGroup.get("password").value;
    const password_confirmation = formGroup.get("password_confirmation").value;
    if (password_confirmation.length > 0) {
      return password === password_confirmation
        ? (this.passwordMatch = true)
        : (this.passwordMatch = false);
    }
  }

  readTerms() {
    console.log(
      " :::::::::::  Lire les conditions générales d'utilisation ::::::::: "
    );
  }
}
