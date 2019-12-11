import { Component, OnInit } from '@angular/core';
import { GlobalvarsService } from '../../services/globalvars.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LoadingService } from 'src/app/services/loading.service';
import { ServiceAppService } from 'src/app/services/service-app.service';
import { NavController, LoadingController } from '@ionic/angular';
import { PatientModel } from '../../models/patient_model';
import { Router, RouterModule, NavigationExtras } from '@angular/router';
@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.page.html',
  styleUrls: ['./inscription.page.scss']
})
export class InscriptionPage implements OnInit {
  IdUser: number;
  objetInsc: any;
  listePatientExist: any;
  isPatient: boolean;
  existFirstName: string;
  existLastName: string;
  existIdPatient: number;
  existDateNaissance: string;
  returnSearchPatient: PatientModel = new PatientModel();

  constructor(
    private sglob: GlobalvarsService,
    private formBuilder: FormBuilder,
    public loading: LoadingService,
    private srv: ServiceAppService,
    public navcrtl: NavController,
    private router: Router
  ) {
    this.isPatient = false;
    this.IdUser = this.sglob.getIdUser();
  }

  get nom() {
    return this.insciptionDossier.get('nom');
  }
  get prenom() {
    return this.insciptionDossier.get('prenom');
  }
  get genre() {
    return this.insciptionDossier.get('genre');
  }
  get dateNaissance() {
    return this.insciptionDossier.get('dateNaissance');
  }
  public errorMessages = {
    nom: [
      { type: 'required', message: 'Le nom d\'utilisateur est requis.' },
      { type: 'maxlength', message: 'Votre saisie ne doit pas dépasser 50 caractères.' },
      { type: 'minLength', message: 'Votre saisie doit comporter au moins 3 caractères.' },
      { type: 'pattern', message: 'Votre saisie doit comporter uniquement des caractères alphabitéque.' }
    ],
    prenom: [
      { type: 'required', message: 'Le prénom d\'utilisateur est requis.' },
      { type: 'maxlength', message: 'Votre saisie ne doit pas dépasser 50 caractères.' },
      { type: 'minLength', message: 'Votre saisie doit comporter au moins 3 caractères.' },
      { type: 'pattern', message: 'Votre saisie doit comporter uniquement des caractères alphabitéque' }
    ],
    genre: [{ type: 'required', message: 'Le mot de passe est requis.' }],
    dateNaissance: [
      { type: 'required', message: 'La date de naissance est requise.' }
    ]
  };
  insciptionDossier = this.formBuilder.group({
    nom: [
      '',
      [
        Validators.required,
        Validators.required,
        Validators.maxLength(50),
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[A-Za-z]+$')
      ]
    ],
    prenom: [
      '',
      [
        Validators.required,
        Validators.required,
        Validators.maxLength(50),
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[A-Za-z]+$')
      ]
    ],
    genre: ['', [Validators.required]],
    dateNaissance: ['', [Validators.required]]
  });

  ngOnInit() { }
  submitform() {
    this.loading.showLoader('Recherche en cours...');
    console.log(this.insciptionDossier.value);
    this.srv.getPatient(this.insciptionDossier.value).then(newsFetched => {
      this.returnSearchPatient = newsFetched;
      console.log('return inscription', this.returnSearchPatient);

      if (this.returnSearchPatient.code === 201) {
        this.loading.hideLoader();
        this.GoToEcgInfos(
          this.insciptionDossier.value.nom,
          this.insciptionDossier.value.prenom,
          this.insciptionDossier.value.dateNaissance,
          0
        );
        this.sglob.presentToast(
          'Le patient vient d\'étre enregistrer dans le système.'
        );
      } else {
        this.loading.hideLoader();
        this.isPatient = true;
        console.log('existe---***', this.returnSearchPatient.items);
        this.listePatientExist = this.returnSearchPatient.items;
        this.sglob.presentToast(
          'le patient existe déja dans le système, veuillez en séléctionner un de la lsite ci-dessous.'
        );
      }
    });
  }

  GoToEcgInfos(nom, prenom, dateNaissance, idPatient) {
    this.objetInsc = {
      firsName: prenom,
      lastName: nom,
      birthday: dateNaissance,
      idMed: this.IdUser,
      idPatient: idPatient
    };
    console.log('objetInsc---***', this.objetInsc);
    this.srv.setExtras(this.objetInsc);
    this.router.navigate(['./insc-ecg']);
  }
}
