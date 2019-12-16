import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ServiceAppService } from "src/app/services/service-app.service";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { File } from "@ionic-native/file/ngx";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { LoadingService } from "src/app/services/loading.service";
import { GlobalvarsService } from "src/app/services/globalvars.service";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer/ngx";
import { HttpHeaders } from "@angular/common/http";
import { DossierResponseData } from "src/app/models/dossier.response";

@Component({
  selector: "app-insc-ecg",
  templateUrl: "./insc-ecg.page.html",
  styleUrls: ["./insc-ecg.page.scss"]
})
export class InscEcgPage implements OnInit {
  firstName: string;
  lastName: string;
  birthday: string;
  gender: number;
  idPatient: number;
  IdUser: number;
  idEtab: number;
  token: string;
  idMed: number;
  idDossier: number;
  data: any;
  isEcg: boolean;
  ecgAfficher: string;
  imageData: any;

  dataPatientObj: object;
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
    this.IdUser = this.sglob.getIdUser();
    this.idEtab = this.sglob.getidEtab();
    this.token = this.sglob.getToken();
    this.data = srv.getExtras();
    if (this.data) {
      this.firstName = this.data.firstName;
      this.lastName = this.data.lastName;
      this.birthday = this.data.birthday;
      this.gender = this.data.gender;
      this.idPatient = this.data.idPatient;
    }

    console.log("**** service data****", this.data);
    console.log("IdUser", this.IdUser);
    console.log("token", this.token);
    this.isEcg = false;
  }

  get poids() {
    return this.EcgForm.get("poids");
  }
  get dThorasic() {
    return this.EcgForm.get("dThorasic");
  }
  public errorMessages = {
    poids: [
      { type: "required", message: "le poids d'utilisateur est obligatoire" },
      { type: "maxlength", message: "3 characters au max" },
      { type: "minLength", message: "2 characters au min" },
      { type: "pattern", message: "caractères numéric seulement" }
    ],
    dThorasic: [{ type: "", message: "veuillez faire un choix" }]
  };
  EcgForm = this.formBuilder.group({
    poids: [
      "",
      [
        Validators.required,
        Validators.maxLength(3),
        Validators.required,
        Validators.minLength(2),
        Validators.pattern("^[0-9]+$")
      ]
    ],
    dThorasic: [false, [Validators.pattern]]
  });

  ngOnInit() {}

  submitEcg() {
    if (this.isEcg) {
      console.log("===== ok pour lenvoi====");
      console.log(" halim :::: dataPatientObj ===>", this.dataPatientObj);
      //this.loading.hideLoader();
      this.upload();
    } else {
      console.log("===== veuiller faire un ECG====");
    }
  }

  deleteImage() {
    this.isEcg = false;
  }

  async upload() {
    this.loading.showLoader("Envoi de données  en cours");
    const fileTransfer: FileTransferObject = this.transfer.create();

    const fileName = this.createFileName();
    const myHeaders: HttpHeaders = new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + this.token
    });

    const options1: FileUploadOptions = {
      fileKey: "file",
      fileName: "ecg_image",
      headers: { myHeaders }
    };

    const params = {
      poids: this.EcgForm.value.poids,
      id_medecin: this.idMed,
      prenom: this.firstName,
      nom: this.lastName,
      birth: this.birthday,
      id_etab: this.idEtab,
      douleur: this.EcgForm.value.dThorasic,
      gender: this.gender,
      id_patient: this.idPatient
    };
    options1.params = params;

    fileTransfer
      .upload(
        this.imageData,
        "http://cardio.cooffa.shop/api/dossiers",
        // "http://webcom.dz/cooffa/sante/u.php",
        options1
      )
      .then(
        res => {
          // success
          console.log("retour upload data ==>", res);
          console.log("retour upload response ==>", JSON.parse(res.response));
          this.idDossier = 128;
          this.dataPatientObj = [
            {
              prenom_patient: this.firstName,
              nom_patient: this.lastName,
              naissance_patient: this.birthday,
              poids: this.EcgForm.value.poids,
              gender_patient: this.gender,
              id_dossier: this.idDossier,
              id_medecin: this.IdUser,
              douleur_thoracique: this.EcgForm.value.dThorasic,
              id_patient: this.idPatient,
              qrcode_patient: "",
              id_etablissement: this.idEtab,
              ecg: this.imageData,
              ecgTmp: this.ecgAfficher,
              start_at: "13:25:00"
            }
          ];
          this.loading.hideLoader();
          this.sglob.presentToast("Données envoyés avec succès.");
          //this.srv.setExtras(this.dataPatientObj);
          this.router.navigate([
            "./insc-infos",
            this.idDossier,
            JSON.stringify(this.dataPatientObj)
          ]);
        },
        err => {
          // error
          this.loading.hideLoader();
          this.sglob.presentToast("Erreur d'envois de données");
          alert("error" + JSON.stringify(err));
        }
      );
  }

  takePicture() {
    console.log("======n0=======");
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: false,
      targetWidth: 640,
      targetHeight: 400,
      correctOrientation: true
    };

    this.camera.getPicture(options).then(imageData => {
      this.isEcg = true;
      this.imageData = imageData;
      this.ecgAfficher = this.pathForImage(imageData);
    });
  }

  pathForImage(img: any) {
    console.log("img", img);
    if (img === null) {
      return "";
    } else {
      const converted = this.webview.convertFileSrc(img);
      console.log("converted", converted);
      return converted;
    }
  }

  createFileName() {
    const d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }
}
