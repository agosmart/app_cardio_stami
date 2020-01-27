import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { LoadingController, AlertController } from "@ionic/angular";
import { LoadingService } from "src/app/services/loading.service";
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { GlobalvarsService } from "src/app/services/globalvars.service";
import { FCM } from "@ionic-native/fcm/ngx";
import { Router } from "@angular/router";

import { Observable } from "rxjs";
import { UserModel } from "src/app/models/user.model";
import { AuthResponseData } from "src/app/models/auth.response";
import { UserService } from "src/app/services/user.service";

// ------------------------------

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  idUser = 0;
  idEtab = 0;
  mobile: string;
  uid: string;
  token: string;
  showEye = false;
  loginForm: FormGroup;
  dataResponse: UserModel;
  isLoading = false;
  isLogin = true;
  // ------------- CONSTRUCTOR ----------------------------
  constructor(
    public loading: LoadingService,
    public loadingController: LoadingController,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private nat: NativeStorage,
    private sglob: GlobalvarsService,
    private fcm: FCM,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
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
      {
        type: "maxlength",
        message: "Votre saisie ne doit pas dépasser 50 caractères."
      },
      {
        type: "minLength",
        message: "Votre saisie doit comporter au moins 3 caractères."
      },
      { type: "pattern", message: "Addresse email non valide" }
    ],
    password: [
      { type: "required", message: "le mot de passe est requis" },
      {
        type: "maxlength",
        message: "Votre saisie ne doit pas dépasser 50 caractères."
      },
      {
        type: "minLength",
        message: "Votre saisie doit comporter au moins 6 caractères."
      }
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
    //this.getUidFcm();
    this.getUidFcm() == null ? (this.uid = "0123456789") : this.getUidFcm();
    this.isLoading = true;
    this.loadingCtrl
      .create({
        keyboardClose: true,
        duration: 10000,
        message: "Connexion en cours..."
      })
      .then(loadingEl => {
        loadingEl.present();

        const params = {
          email: this.loginForm.value.username,
          password: this.loginForm.value.password,
          uid: this.uid,
          userType: 2
        };
        console.log("params======>", params);

        const authObs: Observable<AuthResponseData> = this.userService.loginDoctor(
          params
        );
        // ---- Call Login function
        authObs.subscribe(
          // :::::::::::: ON RESULT ::::::::::
          resData => {
            this.isLoading = false;
            // const dataResponse: UserModel = JSON.stringify(resData.data);
            this.dataResponse = resData.data;
            console.log("Response >>>>> ", resData);
            // ----- Hide loader ------
            loadingEl.dismiss();

            if (+resData.code === 200) {
              this.idUser = this.dataResponse.id;
              this.mobile = this.dataResponse.mobile;
              this.token = this.dataResponse.apiToken;
              this.idEtab = this.dataResponse.etablissment[0].etabId;
              console.log("token login===>", this.token);
              console.log("idEtab login===>", this.idEtab);
              // ----- Set storage Data -----
              this.SetStorage();
              // -----  Update id Doctor value -----
              this.sglob.updateInfoUser(this.idUser, this.token, this.idEtab);
              // ----- Redirection to Home page ------------
              this.router.navigate(["home"]);
            } else {
              // --------- Show Alert --------
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
              //this.showAlert(errRes.error.message);
              this.sglob.showAlert("Erreur ", errRes.error.message);
            } else {
              // this.showAlert(
              //   "Prblème d'accès au réseau, veillez vérifier votre connexion"
              // );
              this.sglob.showAlert(
                "Erreur ",
                "Prblème d'accès au réseau, veillez vérifier votre connexion"
              );
            }
          }
        );
      });
  }

  SetStorage() {
    this.nat
      .setItem("cardio", {
        idUser: this.idUser,
        token: this.token,
        idEtab: this.idEtab
      })
      .then(
        () => console.log("Stored item!", this.idUser),
        error => console.error("Error storing item", error)
      );
  }

  getUidFcm() {
    this.fcm.getToken().then(uid => {
      console.log("constructeur uid is ::::: ", uid);
      this.uid = uid;
      console.log("uid===>", this.uid);
      // this.srv.adduid(token, this.idUser, this.mobile).then(newsFetched => {
      //   this.ReturnLogin = newsFetched;
      // });
    });
  }

  private showAlert1(message: string) {
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
