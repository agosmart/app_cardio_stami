import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { LoadingController, AlertController } from "@ionic/angular";
import { ServiceAppService } from "src/app/services/service-app.service";
import { LoadingService } from "src/app/services/loading.service";
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { GlobalvarsService } from "src/app/services/globalvars.service";
import { FCM } from "@ionic-native/fcm/ngx";
import { Router } from "@angular/router";

import { Observable } from "rxjs";
import { UserModel } from "src/app/models/user.model";
import { AuthResponseData } from "src/app/models/auth.response";

// ------------------------------

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  idUser = 0;
  mobile: string;
  token: string;
  showEye = false;
  loginForm: FormGroup;
  isLoading = false;
  isLogin = true;
  // ------------- CONSTRUCTOR ----------------------------
  constructor(
    public loading: LoadingService,
    public loadingController: LoadingController,
    private formBuilder: FormBuilder,
    private srv: ServiceAppService,
    private router: Router,
    private nat: NativeStorage,
    private sglob: GlobalvarsService,
    private fcm: FCM,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}
  // --------------------------------------------
  get username() {
    return this.loginForm.get("username");
  }
  get password() {
    return this.loginForm.get("password");
  }
  public errorMessages = {
    username: [
      { type: "required", message: "le nom d'utilisateur est requis" },
      { type: "maxlength", message: "50 caractères au max" },
      { type: "minLength", message: "3 caractères au min" },
      { type: "pattern", message: "Adresse email non valide" }
    ],
    password: [
      { type: "required", message: "le mot de passe est requis" },
      { type: "maxlength", message: "50 caractères au maximum" },
      { type: "minLength", message: "6 caractères au minimum" }
    ]
  };

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: [
        "",
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(3),
          Validators.pattern(
            "^[a-z0-9]+(.[_a-z0-9]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,15})$"
          )
        ]
      ],
      password: [
        "",
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(3)
          // Validators.pattern('^[A-Za-z]+$')
        ]
      ]
    });
  }

  // ----- Action to Show/Hide icon - Password /Text type

  showEyeIcon() {
    this.showEye = !this.showEye;
  }

  // ------ Api service login ---------------
  submitLogin() {
    // const username = this.loginForm.value.username;
    // const password = this.loginForm.value.password;
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: "Connexion en cours..." })
      .then(loadingEl => {
        loadingEl.present();

        const params = {
          email: this.loginForm.value.username,
          password: this.loginForm.value.password
        };
        const authObs: Observable<AuthResponseData> = this.srv.loginDoctor(
          params
        );
        // ---- Call Login function
        authObs.subscribe(
          // :::::::::::: ON RESULT ::::::::::
          resData => {
            this.isLoading = false;
            // const dataResponse: UserModel = JSON.stringify(resData.data);
            const dataResponse: UserModel = resData.data;
            console.log("Response >>>>> ", resData);
            // ----- Hide loader ------
            loadingEl.dismiss();

            if (+resData.code === 200) {
              this.idUser = dataResponse.id;
              this.mobile = dataResponse.mobile;
              this.token = dataResponse.api_token;
              // ----- Set storage Data -----
              this.SetStorage();
              // -----  Update id Doctor value -----
              this.sglob.updateInfoUser(this.idUser, this.token);
              // ----- Retrive a value of Token -----
              this.getTokenFcm();
              // ----- Toast ------------
              this.sglob.presentToast(resData.message);
              // ----- Redirection to Home page ------------
              this.router.navigate(["home"]);
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
            // if (errRes.status === 422) {
            //   message =
            //     "L'authentification a échouée, êtes-vous sûr de vos identifiants6v6v6v6vv ? ";
            // } else if (errRes.status === 401 || errRes.status === 403) {
            //   message = " Accès à la ressource refusé ";
            // } else if (errRes.status === 404) {
            //   message = " Document non trouvé ";
            // } else if (
            //   errRes.status === 105 ||
            //   errRes.status === 106 ||
            //   errRes.status === 511
            // ) {
            //   message =
            //     " Prblème d'accès au réseau, veillez vérifier votre connexion ";
            // } else {
            //   message = "L'authentification a échouée,erreur inconu ! ";
            // }
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

  SetStorage() {
    this.nat.setItem("cardio", { idUser: this.idUser, token: this.token }).then(
      () => console.log("Stored item!", this.idUser),
      error => console.error("Error storing item", error)
    );
  }

  getTokenFcm() {
    this.fcm.getToken().then(token => {
      console.log("constructeur token is ::::: ", token);
      // this.srv.addToken(token, this.idUser, this.mobile).then(newsFetched => {
      //   this.ReturnLogin = newsFetched;
      // });
    });
  }
}
