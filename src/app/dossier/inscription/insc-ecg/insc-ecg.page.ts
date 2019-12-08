import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceAppService } from 'src/app/services/service-app.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { LoadingService } from 'src/app/services/loading.service';
import { GlobalvarsService } from 'src/app/services/globalvars.service';
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from '@ionic-native/file-transfer/ngx';

@Component({
  selector: 'app-insc-ecg',
  templateUrl: './insc-ecg.page.html',
  styleUrls: ['./insc-ecg.page.scss']
})
export class InscEcgPage implements OnInit {
  firstName: string;
  lastName: string;
  dateNaissance: string;
  idPatient: number;
  idUser: number;
  idMed: number;
  idDossier: number;
  data: any;
  isEcg: boolean;
  ecgAfficher: string;
  imageData: any;

  objetInsc: object;
  constructor(
    public loading: LoadingService,
    private sglob: GlobalvarsService,
    private route: ActivatedRoute,
    private router: Router,
    private srv: ServiceAppService,
    private formBuilder: FormBuilder,
    private camera: Camera,
    private file: File,
    // tslint:disable-next-line: deprecation
    private transfer: FileTransfer,
    private webview: WebView
  ) {
    this.data = srv.getExtras();
    if (this.data) {
      this.idUser = this.data.idMed;
      this.firstName = this.data.firsName;
      this.lastName = this.data.lastName;
      this.dateNaissance = this.data.birthday;
      this.idPatient = this.data.idPatient;
      this.idMed = this.data.idMed;
      this.idDossier = this.data.idDossier;
    }

    this.isEcg = false;
  }

  get poids() {
    return this.EcgForm.get('poids');
  }
  get dThorasic() {
    return this.EcgForm.get('poids');
  }
  public errorMessages = {
    poids: [
      { type: 'required', message: 'le poids d\'utilisateur est obligatoire' },
      { type: 'maxlength', message: '3 characters au max' },
      { type: 'minLength', message: '2 characters au min' },
      { type: 'pattern', message: 'caractères numéric seulement' }
    ],
    dThorasic: [{ type: 'required', message: 'veuillez faire un choix' }]
  };
  EcgForm = this.formBuilder.group({
    poids: [
      '',
      [
        Validators.required,
        Validators.maxLength(3),
        Validators.required,
        Validators.minLength(2),
        Validators.pattern('^[0-9]+$')
      ]
    ],
    dThorasic: ['', [Validators.required]]
  });

  ngOnInit() { }

  submitEcg() {
    if (this.isEcg) {
      console.log('===== ok pour lenvoi====');
      this.upload();
    } else {
      console.log('===== veuiller faire un ECG====');
    }
  }

  deleteImage() {
    this.isEcg = false;
  }

  async upload() {
    this.loading.showLoader('Envoi de données  en cours');
    const fileTransfer: FileTransferObject = this.transfer.create();

    const fileName = this.createFileName();

    const options1: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'fileName',
      headers: {}
    };

    const params = {
      poids: this.EcgForm.value.poids,
      idUser: this.idMed,
      prenom: this.firstName,
      nom: this.lastName,
      dateNaissance: this.dateNaissance,
      idPatient: this.idPatient
    };
    options1.params = params;

    fileTransfer
      .upload(
        this.imageData,
        'http://41.110.24.164/cooffa/sante/u.php',
        options1
      )
      .then(
        data => {
          // success
          // loading.dismiss();
          // this.idDossier = data.response.idDossier;
          // this.idPatient = data.response.idPatient;
          // alert(this.data.response);
          // console.log('retour upload', data);
          console.log('retour upload', data.response);
          this.objetInsc = {
            firsName: this.firstName,
            lastName: this.lastName,
            birthday: this.dateNaissance,
            poids: this.EcgForm.value.poids,
            idDossier: this.idDossier,
            idMed: this.idUser,
            dThorasic: this.EcgForm.value.dThorasic,
            idPatient: this.idPatient,
          };
          this.loading.hideLoader();
          this.sglob.presentToast('Données envoyés avec succès.');
          this.srv.setExtras(this.objetInsc);
          this.router.navigate(['./insc-infos', this.idDossier]);
        },
        err => {
          // error
          this.loading.hideLoader();
          this.sglob.presentToast('Erreur d\'envois de données');
          alert('error' + JSON.stringify(err));
        }
      );
  }

  takePicture() {
    console.log('======n0=======');
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    this.camera.getPicture(options).then(imageData => {
      this.isEcg = true;
      this.imageData = imageData;
      this.ecgAfficher = this.pathForImage(imageData);
    });
  }

  pathForImage(img: any) {
    console.log('img', img);
    if (img === null) {
      return '';
    } else {
      const converted = this.webview.convertFileSrc(img);
      console.log('converted', converted);
      return converted;
    }
  }

  createFileName() {
    const d = new Date(),
      n = d.getTime(),
      newFileName = n + '.jpg';
    return newFileName;
  }
}
