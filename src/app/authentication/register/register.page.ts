import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ServiceAppService } from 'src/app/services/service-app.service';
import { LoadingService } from 'src/app/services/loading.service';
import { StandarReturnModel } from '../../models/StandarReturnMdel';
import { LoadingController, AlertController } from '@ionic/angular';
import { GlobalvarsService } from 'src/app/services/globalvars.service';
import { Router } from '@angular/router';
import { ApiService, AuthResponseData } from 'src/app/api/api.service';
import { Observable } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage implements OnInit {
  ChoixCR = 0;
  itermsCR: any;
  itemsCudt: any;
  retunListeCR: StandarReturnModel;
  retunListeCUDT: StandarReturnModel;
  returnInscription: StandarReturnModel;
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
    private apiService: ApiService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    this.srv.getListeCR().then((newsFetched: any) => {
      this.retunListeCR = newsFetched;
      console.log('return liste cr', this.retunListeCR);
      if (this.retunListeCR.code === 200) {
        console.log('ok');
        this.itermsCR = this.retunListeCR.items;
        console.log('nom etab cudt', this.itermsCR[0]['nomEtab']);
      } else {
        console.log('no');
      }
    });
  }

  get lastName() {
    return this.registrationForm.get('lastName');
  }
  get firstName() {
    return this.registrationForm.get('firstName');
  }
  get mobile() {
    return this.registrationForm.get('mobile');
  }
  get username() {
    return this.registrationForm.get('username');
  }
  get password() {
    return this.registrationForm.get('password');
  }
  get passwordc() {
    return this.registrationForm.get('passwordc');
  }
  get gender() {
    return this.registrationForm.get('gender');
  }
  get cr() {
    return this.registrationForm.get('cr');
  }
  get cudt() {
    return this.registrationForm.get('cudt');
  }
  get terms() {
    return this.registrationForm.get('terms');
  }

  errorMessages = {
    lastName: [
      { type: 'required', message: 'le nom est requis' },
      { type: 'maxlength', message: '50 caractères au max' },
      { type: 'minLength', message: '3 caractères au min' },
      { type: 'pattern', message: 'caractères alphabitéque seulement ' }
    ],
    firstName: [
      { type: 'required', message: 'le prénom est requis' },
      { type: 'maxlength', message: '50 caractères au max' },
      { type: 'minLength', message: '3 caractères au min' },
      { type: 'pattern', message: 'caractères alphabitéque seulement' }
    ],
    mobile: [
      { type: 'required', message: 'le numéro de téléphone est requis' },
      { type: 'pattern', message: 'le numéro n`est pas valide' }
    ],
    username: [
      { type: 'required', message: 'le nom d\'utilisateur est requis' },
      { type: 'maxlength', message: '50 caractères au max' },
      { type: 'minLength', message: '3 caractères au min' },
      { type: 'pattern', message: 'Adresse email non valide' }
    ],
    password: [
      { type: 'required', message: 'le mot de passe est requis' },
      { type: 'maxlength', message: '50 caractères au max' },
      { type: 'minLength', message: '6 caractères au min' },
      { type: 'pattern', message: 'caractères alphabitéque seulement' }
    ],
    passwordc: [
      { type: 'required', message: 'la confirmation du mot de passe est requise' },
      { type: 'maxlength', message: '50 caractères au max' },
      { type: 'minLength', message: '6 caractères au min' },
      // { type: 'pattern', message: 'caractères alphabitéque seulement' }
    ],
    gender: [{ type: 'required', message: 'Votre civilité est requise' }],
    cr: [{ type: 'required', message: 'Le nom du CR est required' }],
    cudt: [{ type: 'required', message: 'Le nom du CUDT est requis' }],
    terms: [{ type: 'pattern', message: 'vous devez accepter les conditions générales pour continuer' }]
  };

  ngOnInit() {

    this.genders = ['Homme', 'Femme'];

    this.registrationForm = this.formBuilder.group(
      {
        lastName: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
            Validators.pattern('^[A-Za-z]+$')
          ]
        ],
        firstName: [
          '',
          [

            Validators.required,
            Validators.maxLength(50),
            Validators.minLength(3),
            Validators.pattern('^[A-Za-z]+$')
          ]
        ],
        mobile: [
          '',
          [
            Validators.required,
            Validators.pattern('^(00213|213|0)(5|6|7)[0-9]{8}$')
          ]
        ],
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
          [Validators.required,
          Validators.required,
          Validators.maxLength(50),
          Validators.required,
          Validators.minLength(6),
            // Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
          ]
        ],
        passwordc: ['',
          [Validators.required,
          Validators.maxLength(50),
          Validators.minLength(6),
          ]
        ],

        gender: [this.genders[0], [Validators.required]],
        cr: ['', [Validators.required]],
        cudt: ['', [Validators.required]],
        terms: [true, [Validators.pattern('true')]]
      },
      {
        validators: this.matchingPasswords.bind(this)
      }
    );
  }

  // ------ Api service login ---------------
  submitRgister() {
    // const username = this.loginForm.value.username;
    // const password = this.loginForm.value.password;
    this.isLoading = true;
    this.loadingCtrl.create(
      { keyboardClose: true, message: 'Inscription en cours...' }
    ).then((loadingEl) => {
      loadingEl.present();
      const params = this.registrationForm.value;
      const authObs: Observable<AuthResponseData> = this.apiService.registerDoctor(params);
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

          if (+resData.code === 201) {
            message = 'Félicitation Docteur, votre compte a été créée avec succès';
            // ------- Reset Form -------
            this.registrationForm.reset();
            // ----- Toast ------------
            this.sglob.presentToast(message);
            // ----- Redirection to login page ------------
            this.router.navigate(['./login']);

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
            message = 'La création de votre compte a échouée, veillez vérifier votre connexion  ';
          } else if (errRes.status === 401 || errRes.status === 403) {
            message = ' Accès à la ressource refusé ';
          } else if (errRes.status === 404) {
            message = ' Document non trouvé ';
          } else if (errRes.status === 105 || errRes.status === 106 || errRes.status === 511) {
            message = ' Prblème d\'accès au réseau, veillez vérifier votre connecxion ';
          } else {
            message = 'La création de votre compte a échouée, erreur inconu ! ';
          }
          // --------- Show Alert --------
          this.showAlert(message);
        });
    });
  }

  // data {"id": 62,
  //       "nom": "sam",
  //       "prenom": "ali",
  //       "gender": "2",
  //       "date_naissance": null,
  //       "email": "test@gmail.com",
  //       "mobile": "0560114888",
  //       "etablissement_id": "5",
  //       "api_token": "L4sQdTWIifdO5kOi3IkCmOp3KFePF6JdvXQaoPpTrtU5ogMhIaIo5OUNKcdb"
  //      }


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



  OnChangeCR(event: any) {
    this.ChoixCR = 1;
    console.log('values forms', this.registrationForm.value.cr);
    this.srv
      .getListeCudtByCR(this.registrationForm.value.cr)
      .then((newsFetched: any) => {
        this.retunListeCUDT = newsFetched;
        console.log('return liste cudt', this.retunListeCUDT);
        if (this.retunListeCUDT.code === 200) {
          console.log('ok');
          this.itemsCudt = this.retunListeCUDT.items;
          console.log('nom etab cudt', this.itermsCR[0]['nomEtab']);
        } else {
          console.log('no');
        }
      });
  }

  matchingPasswords(formGroup: FormGroup) {
    const password = formGroup.get('password').value;
    const passwordc = formGroup.get('passwordc').value;
    if (passwordc.length > 0) {
      return password === passwordc
        ? (this.passwordMatch = true)
        : (this.passwordMatch = false);
    }
  }

  readTerms() {
    console.log(' :::::::::::  Lire les conditions générales d\'utilisation ::::::::: ');
  }

  // public submit() {
  //   // ----- Show loader ------
  //   this.loading.showLoader('inscription en cours... ');
  //   console.log(this.registrationForm.value);
  //   const params = this.registrationForm.value;
  //   // ---- Call registration function
  //   this.apiService.registerDoctor(params).subscribe(

  //     (dataReturnFromService) => {
  //       this.dataReturnService = JSON.stringify(dataReturnFromService);
  //       console.log('Return Rgister >>>>> ', this.dataReturnService);
  //       if (this.dataReturnService === 200) {
  //         console.log('::: You are registred :::');
  //         // ----- Hide loader ------
  //         this.loading.hideLoader();
  //         // ----- Toast ------------
  //         this.sglob.presentToast('Félicitation! Vous êtes inscrit à STAMI');
  //         this.router.navigate(['./login']);

  //       } else {
  //         // ----- Hide loader ------
  //         this.loading.hideLoader();
  //         // ----- Toast ------------
  //         this.sglob.presentToast('problème dìnscription');
  //       }
  //     });
  // }


  // public submit___() {
  //   this.loading.showLoader('inscription en cours... ');
  //   console.log(this.registrationForm.value);
  //   this.srv.Inscription(this.registrationForm.value).then(newsFetched => {
  //     this.returnInscription = newsFetched;
  //     console.log('return inscription', this.returnInscription);
  //     if (this.returnInscription.code === 200) {
  //       this.loading.hideLoader();
  //       this.sglob.presentToast('inscription avec succès...bienvenus');
  //       // -------Redirect to login page -------
  //       this.router.navigate(['./login']);
  //     } else {
  //       this.loading.hideLoader();
  //       this.sglob.presentToast('problème dìnscription');
  //     }
  //   });
  // }

}
