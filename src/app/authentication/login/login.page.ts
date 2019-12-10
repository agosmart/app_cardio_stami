import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { ServiceAppService } from 'src/app/services/service-app.service';
import { LoadingService } from 'src/app/services/loading.service';
import { StandarReturnModel } from '../../models/StandarReturnMdel';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { GlobalvarsService } from 'src/app/services/globalvars.service';
import { FCM } from '@ionic-native/fcm/ngx';
import { Router } from '@angular/router';


import { ApiService, AuthResponseData } from 'src/app/api/api.service';
import { Observable } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';

// ------------------------------



@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  idUser = 0;
  ReturnLogin: StandarReturnModel;//= new StandarReturnModel();
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
    private apiService: ApiService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }
  // --------------------------------------------
  get username() {
    return this.loginForm.get('username');
  }
  get password() {
    return this.loginForm.get('password');
  }
  public errorMessages = {
    username: [
      { type: 'required', message: 'le nom d\'utilisateur est requis' },
      { type: 'maxlength', message: '50 caractères au max' },
      { type: 'minLength', message: '3 caractères au min' },
      { type: 'pattern', message: 'Adresse email non valide' }
    ],
    password: [
      { type: 'required', message: 'le mot de passe est requis' },
      { type: 'maxlength', message: '50 caractères au maximum' },
      { type: 'minLength', message: '6 caractères au minimum' }
    ]
  };


  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(3),
          Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$')

        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(3),
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
    this.loadingCtrl.create(
      { keyboardClose: true, message: 'Connexion en cours...' }
    ).then((loadingEl) => {
      loadingEl.present();

      const params = { email: this.loginForm.value.username, password: this.loginForm.value.password };
      const authObs: Observable<AuthResponseData> = this.apiService.loginDoctor(params);
      let message = '';
      // ---- Call Login function
      authObs.subscribe(
        // :::::::::::: ON RESULT ::::::::::
        (resData) => {
          this.isLoading = false;
         // const dataResponse: UserModel = JSON.stringify(resData.data);
          const dataResponse: UserModel = resData.data;
          console.log('Response >>>>> ', resData);
          // ----- Hide loader ------
          loadingEl.dismiss();

          if (+resData.code === 200) {
            message = 'Authentification réussie, bienvenus Docteur ' + dataResponse.nom + ' sur STAMI';
            this.idUser = dataResponse.id;
            // ----- Set storage Data -----
            this.SetStorage();
            // -----  Update id Doctor value -----
            this.sglob.updateIdUser(this.idUser);
            // ----- Retrive a value of Token -----
            this.getTokenFcm();
            // ----- Toast ------------
            this.sglob.presentToast(message);
            // ----- Redirection to Home page ------------
            this.router.navigate(['home']);

          } else if (+resData.code === 201) {
            message = ' Félicitation Docteur, votre compte a été créée avec succès';
            // ----- Toast ------------
            this.sglob.presentToast(message);
            // console.log('::: Félicitation Docteur, votre compte a été créée avec succès ::: ');

          } else {
            message = 'L\'authentification a échouée,erreur inconu !';
            // --------- Show Alert --------
            this.showAlert(message);
          }
        },

        // ::::::::::::  ON ERROR ::::::::::::
        (errRes) => {
          // ----- Hide loader ------
          loadingEl.dismiss();

          if (errRes.status === 422) {
            message = 'L\'authentification a échouée, êtes-vous sûr de vos identifiants ? ';

          } else if (errRes.status === 401 || errRes.status === 403) {
            message = ' Accès à la ressource refusé ';
          } else if (errRes.status === 404) {
            message = ' Document non trouvé ';
          } else if (errRes.status === 105 || errRes.status === 106 || errRes.status === 511) {
            message = ' Prblème d\'accès au réseau, veillez vérifier votre connexion ';
          } else {
            message = 'L\'authentification a échouée,erreur inconu ! ';
          }
          // --------- Show Alert --------
          this.showAlert(message);
        });
    });
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Résultat d\'authentication',
        message: message,
        cssClass: 'alert-css',
        buttons: ['Okay']
      })
      .then(alertEl => alertEl.present());
  }


  // submitLogin_() {
  //   this.loading.showLoader('Connexion en cours');
  //   this.srv.login(this.loginForm.value).then(newsFetched => {
  //     this.ReturnLogin = newsFetched;
  //     console.log('return login', this.ReturnLogin);
  //     if (this.ReturnLogin.code === 200) {
  //       console.log('ok');
  //       this.idUser = this.ReturnLogin.idUser;
  //       this.SetStorage();
  //       this.sglob.updateIdUser(this.idUser);
  //       this.getTokenFcm();
  //       this.loading.hideLoader();
  //       this.sglob.presentToast(
  //         'Authentification réussi, bienvenus sur STAMI'
  //       );
  //       this.router.navigate(['home']);
  //     } else {
  //       this.loading.hideLoader();
  //       this.sglob.presentToast('Veuillez vérifier vos identifiants');
  //       console.log('no');
  //     }
  //   });
  // }

  SetStorage() {
    this.nat.setItem('cardio', { idUser: this.idUser }).then(
      () => console.log('Stored item!', this.idUser),
      error => console.error('Error storing item', error)
    );
  }

  getTokenFcm() {
    this.fcm.getToken().then(token => {
      console.log('constructeur token is ::::: ', token);
      this.srv.addToken(token, this.idUser).then(newsFetched => {
        this.ReturnLogin = newsFetched;
      });
    });
  }
}
