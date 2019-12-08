import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ServiceAppService } from 'src/app/services/service-app.service';
import { LoadingService } from 'src/app/services/loading.service';
import { StandarReturnModel } from '../../models/StandarReturnMdel';
import {  LoadingController } from '@ionic/angular';
import { GlobalvarsService } from 'src/app/services/globalvars.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage implements OnInit {
  ChoixCR = 0;
  itermsCR: any;
  itemsCudt: any;
  retunListeCR: StandarReturnModel = new StandarReturnModel();
  retunListeCUDT: StandarReturnModel = new StandarReturnModel();
  returnInscription: StandarReturnModel = new StandarReturnModel();
  passwordMatch = true;

  registrationForm: FormGroup;

  genders: Array<string>;

  constructor(
    public loading: LoadingService,
    private formBuilder: FormBuilder,
    private srv: ServiceAppService,
    public router: Router,
    private sglob: GlobalvarsService
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



  public submit() {
    this.loading.showLoader('inscription en cours... ');
    console.log(this.registrationForm.value);
    this.srv.Inscription(this.registrationForm.value).then(newsFetched => {
      this.returnInscription = newsFetched;
      console.log('return inscription', this.returnInscription);
      if (this.returnInscription.code === 200) {
        this.loading.hideLoader();
        this.sglob.presentToast('inscription avec succès...bienvenus');
        // -------Redirect to login page -------
        this.router.navigate(['./login']);
      } else {
        this.loading.hideLoader();
        this.sglob.presentToast('problème dìnscription');
      }
    });
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
}
