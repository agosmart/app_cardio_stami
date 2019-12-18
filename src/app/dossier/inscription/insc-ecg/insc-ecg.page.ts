import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ServiceAppService } from "src/app/services/service-app.service";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { File } from "@ionic-native/file/ngx";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { LoadingService } from "src/app/services/loading.service";
import { GlobalvarsService } from "src/app/services/globalvars.service";
import { finalize } from "rxjs/operators";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer/ngx";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { DossierResponseData } from "src/app/models/dossier.response";
import { DossierModel } from "src/app/models/dossier.model";

@Component({
  selector: "app-insc-ecg",
  templateUrl: "./insc-ecg.page.html",
  styleUrls: ["./insc-ecg.page.scss"]
})
export class InscEcgPage implements OnInit {
  firstName: string;
  lastName: string;
  birthDay: string;
  gender: number;
  idPatient: number;
  idUser: number;
  idEtab: number;
  token: string;
  idMed: number;
  idDossier: number;
  data: any;
  isEcg: boolean;
  ecgAfficher: string;
  imageData: any;

  dataPatient: DossierModel;
  dataPatients: Array<DossierModel>;

  dataPatientObj: object;
  // activatedroute: any;

  constructor(
    public loading: LoadingService,
    private sglob: GlobalvarsService,
    private router: Router,
    private srv: ServiceAppService,
    private formBuilder: FormBuilder,
    private camera: Camera,
    private file: File,
    private transfer: FileTransfer,
    private webview: WebView,
    private activatedroute: ActivatedRoute,
    public http: HttpClient
  ) {
    this.idUser = this.sglob.getIdUser();
    this.idEtab = this.sglob.getidEtab();
    this.token = this.sglob.getToken();
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

  ngOnInit() {
    this.activatedroute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("dataPatientObj")) {
        /* ========================================
                  Redirection to Home
       =========================================== */
        this.router.navigate(["/home"]);
      } else {
        this.dataPatient = JSON.parse(paramMap.get("dataPatientObj"));
        console.log(" recu set dataPatients:::", this.dataPatient);
        this.gender = this.dataPatient["gender"];
      }
    });
  }

  submitEcg() {
    if (!this.isEcg) {
      this.idDossier = 115;
      this.imageData = "file:/";
      this.ecgAfficher = "http:/";
      // create object
      this.dataPatient.dossierId = this.idDossier;
      this.dataPatient.weight = this.EcgForm.value.poids;
      this.dataPatient.doctorId = this.idUser;
      this.dataPatient.dThorasic = this.EcgForm.value.dThorasic;
      this.dataPatient.patientId = this.idPatient;
      this.dataPatient.etabId = this.idEtab;
      this.dataPatient.ecgImage = this.imageData;
      this.dataPatient.ecgAfficher = this.ecgAfficher;
      this.dataPatient.startAt = "13:25:00";

      console.log("===== dataPatient envoye ===", this.dataPatient);
      this.sglob.presentToast("Données envoyés avec succès.");
      //this.srv.setExtras(this.dataPatientObj);
      this.router.navigate([
        "./insc-infos",
        this.idDossier,
        JSON.stringify(this.dataPatient)
      ]);
      //this.upload();
      //this.uploadImageData();
      //this.uploadold();
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
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + this.token
    });

    const options1: FileUploadOptions = {
      fileKey: "file",
      fileName: "ecg_image",
      headers: { myHeaders }
    };

    const params = {
      weight: this.EcgForm.value.poids,
      doctorId: this.idMed,
      lastName: this.firstName,
      firstName: this.lastName,
      birthday: this.birthDay,
      etabId: this.idEtab,
      dThorasic: this.EcgForm.value.dThorasic,
      gender: this.gender,
      patientId: this.idPatient
    };
    options1.params = params;

    fileTransfer
      .upload(
        this.imageData,
        //"http://cardio.cooffa.shop/api/dossiers",
        "http://webcom.dz/cooffa/sante/u.php",
        options1
      )
      .then(
        res => {
          // success
          alert("succes");
          console.log("retour upload data ==>", res);
          console.log("retour upload response ==>", JSON.parse(res.response));
          this.idDossier = 128;

          this.loading.hideLoader();
          this.sglob.presentToast("Données envoyés avec succès.");
          //this.srv.setExtras(this.dataPatientObj);
          this.router.navigate([
            "./insc-infos",
            this.idDossier,
            JSON.stringify(this.dataPatient)
          ]);
        },
        err => {
          // error
          this.loading.hideLoader();
          this.sglob.presentToast("Erreur d'envois de données");
          alert("erreur");
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

  async uploadImageData() {
    const pathurl = this.pathForImage(this.imageData);
    const currentName = this.imageData.substr(
      this.imageData.lastIndexOf("/") + 1
    );
    const imgEntry = {
      name: currentName,
      path: pathurl,
      filePath: this.imageData
      // weight: 50,
      // doctorId: 160,
      // lastName: "firstName",
      // firstName: "lastName",
      // birthday: "birthDay",
      // etabId: 3,
      // dThorasic: "n",
      // gender: 2,
      // patientId: 1
    };
    console.log("************uploadImageData imgEntry **********", imgEntry);
    console.log(
      "************uploadImageData imageData1 **********",
      this.imageData
    );

    //     Content-Disposition: form-data; name="file"; filename="1576616964464.jpg"
    // Content-Type: image/jpeg
    // const url = "http://cardio.cooffa.shop/api/dossiers";
    const url = "http://cardio.cooffa.shop/u.php";
    const myHeaders: HttpHeaders = new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + this.token
    });
    this.http
      .post(url, imgEntry, { headers: myHeaders })
      .pipe(finalize(() => {}))
      .subscribe(
        (res: DossierResponseData) => {
          if (+res.code === 201) {
            this.sglob.presentToast("File upload complete.");
            console.log("resultat", res);
          } else {
            this.sglob.presentToast("File upload failed.");
            console.log("erreur  cas code");
          }
        },
        // ::::::::::::  ON ERROR ::::::::::::
        errRes => {
          console.log(errRes);
          // ----- Hide loader ------

          // --------- Show Alert --------
          if (errRes.error.errors != null) {
            console.log("errors", errRes.error.errors);
          } else {
            console.log(
              "Prblème d'accès au réseau, veillez vérifier votre connexion"
            );
          }
        }
      );
  }

  async uploadold() {
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
      dateNaissance: this.birthDay,
      id_etab: this.idEtab,
      douleur: this.EcgForm.value.dThorasic,
      id_patient: this.idPatient
    };
    options1.params = params;

    fileTransfer
      .upload(
        this.imageData,
        "http://cardio.cooffa.shop/api/dossiers",
        options1
      )
      .then(
        data => {
          // success
          console.log(" moha retour upload", data);
          // this.dataPatientObj = [
          //   {
          //     firsName: this.firstName,
          //     lastName: this.lastName,
          //     birthday: this.birthDay,
          //     weight: this.EcgForm.value.poids,
          //     idDossier: this.idDossier,
          //     idMed: this.idUser,
          //     dThorasic: this.EcgForm.value.dThorasic,
          //     idPatient: this.idPatient,
          //     imgEcg: this.imageData,
          //     startTime: "13:25:00"
          //   }
          // ];
          this.loading.hideLoader();
          // this.sglob.presentToast("Données envoyés avec succès.");
          // //this.srv.setExtras(this.dataPatientObj);
          // this.router.navigate([
          //   "./insc-infos",
          //   this.idDossier,
          //   JSON.stringify(this.dataPatientObj)
          // ]);
        },
        err => {
          // error
          this.loading.hideLoader();
          this.sglob.presentToast("Erreur d'envois de données");
          alert("error" + JSON.stringify(err));
        }
      );
  }
}
