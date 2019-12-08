import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NavController, LoadingController } from '@ionic/angular';
import { ServiceAppService } from 'src/app/services/service-app.service';
import { LoadingService } from 'src/app/services/loading.service';
import { StandarReturnModel } from '../../models/StandarReturnMdel';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { GlobalvarsService } from 'src/app/services/globalvars.service';
import { FCM } from '@ionic-native/fcm/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  IdUser = 0;
  ReturnLogin: StandarReturnModel = new StandarReturnModel();
  showEye = false;

  loginForm: FormGroup;


  constructor(
    public loading: LoadingService,
    public loadingController: LoadingController,
    private formBuilder: FormBuilder,
    private srv: ServiceAppService,
    public navcrtl: NavController,
    private nat: NativeStorage,
    private sglob: GlobalvarsService,
    private fcm: FCM
  ) { }
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
        //  Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$')

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


  showEyeIcon() {
    this.showEye = !this.showEye;
  }

  submitLogin() {
    this.loading.showLoader('Connexion en cours');
    this.srv.login(this.loginForm.value).then(newsFetched => {
      this.ReturnLogin = newsFetched;
      console.log('return login', this.ReturnLogin);
      if (this.ReturnLogin.code === 200) {
        console.log('ok');
        this.IdUser = this.ReturnLogin.IdUser;
        this.SetStorage();
        this.sglob.update_IdUser(this.IdUser);
        this.getTokenFcm();
        this.loading.hideLoader();
        this.sglob.presentToast(
          'authnetification faites avec succès...bienvenus'
        );
        this.navcrtl.navigateRoot('home');
      } else {
        this.loading.hideLoader();
        this.sglob.presentToast('Veuillez vérifier vos identifiants');
        console.log('no');
      }
    });
  }

  SetStorage() {
    this.nat.setItem('cardio', { IdUser: this.IdUser }).then(
      () => console.log('Stored item!', this.IdUser),
      error => console.error('Error storing item', error)
    );
  }

  getTokenFcm() {
    this.fcm.getToken().then(token => {
      console.log('constructeur token is', token);
      this.srv.AddToken(token, this.IdUser).then(newsFetched => {
        this.ReturnLogin = newsFetched;
      });
    });
  }
}
