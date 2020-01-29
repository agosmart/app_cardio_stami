import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ServiceAppService } from "src/app/services/service-app.service";
import { UploadFileService } from "src/app/services/upload-file.service";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { File, FileEntry } from "@ionic-native/file/ngx";
import { LoadingService } from "src/app/services/loading.service";
import { GlobalvarsService } from "src/app/services/globalvars.service";
import { finalize } from "rxjs/operators";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer/ngx";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { DossierModel } from "src/app/models/dossier.model";
import { Observable } from "rxjs";
import { PatientResponseData } from "src/app/models/patient.response";
import { DossierResponseData } from "src/app/models/dossier.response";
import { AlertController, LoadingController } from "@ionic/angular";

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
  idPatient = 0;
  idUser: number;
  idEtab: number;
  token: string;
  idMed: number;
  idDossier: number;
  data: any;
  isEcg: boolean;
  ecgAfficher: string;
  imageData: any;
  stepId = 4; // etape Infos Dossier
  startAt: string;

  dataPatient: DossierModel;
  dataPatients: Array<DossierModel>;

  dataPatientObj: object;
  // activatedroute: any;

  constructor(
    public loading: LoadingService,
    private sglob: GlobalvarsService,
    private srvUploadecg: UploadFileService,
    private router: Router,
    private srv: ServiceAppService,
    private formBuilder: FormBuilder,
    private camera: Camera,
    private file: File,
    private transfer: FileTransfer,
    private activatedroute: ActivatedRoute,
    public http: HttpClient,
    private alertCtrl: AlertController,
    public loadingController: LoadingController
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
    this.startAt =
      new Date().getHours().toString() +
      ":" +
      new Date().getMinutes().toString() +
      ":" +
      new Date().getSeconds().toString();
    // toString(new Date().getMinutes());
    console.log("Current Date ", this.startAt);

    this.activatedroute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("dataPatientObj")) {
        /* ========================================
                  Redirection to Home
       =========================================== */
        this.router.navigate(["/home"]);
      } else {
        this.dataPatient = JSON.parse(paramMap.get("dataPatientObj"));
        console.log(" recu set dataPatients:::", this.dataPatient);
        this.gender = this.dataPatient.gender;

        console.log(" gender:::", this.gender);
      }
    });
  }

  // without upload
  submitEcg_withoutUpload() {
    // if (!this.isEcg) {
    //   this.idDossier = 200;
    //   this.imageData = "file:/";
    //   this.ecgAfficher = "http:/";
    //   this.dataPatient.dossierId = this.idDossier;
    //   this.dataPatient.weight = this.EcgForm.value.poids;
    //   this.dataPatient.doctorId = this.idUser;
    //   this.dataPatient.dThorasic = this.EcgForm.value.dThorasic;
    //   this.dataPatient.patientId = this.idPatient;
    //   this.dataPatient.etabId = this.idEtab;
    //   this.dataPatient.ecgImage = this.imageData;
    //   this.dataPatient.ecgAfficher = this.ecgAfficher;
    //   this.dataPatient.startAt = this.startAt;
    //   console.log("===== dataPatient envoye ===", this.dataPatient);
    //   this.sglob.presentToast("Données envoyés avec succès.");
    //   this.router.navigate([
    //     "./insc-infos",
    //     this.idDossier,
    //     JSON.stringify([this.dataPatient])
    //   ]);
    //   //this.upload();
    //   //this.uploadImageData();
    //   //this.startUpload();
    // } else {
    //   console.log("===== veuiller faire un ECG====");
    // }
  }
  submitEcg() {
    if (this.isEcg) {
      console.log(" submitEcg", this.idDossier);
      this.startUpload();
      //this.fortesting();
    } else {
      this.sglob.showAlert("Erreur ", "veuiller faire l'ECG");
    }
  }

  fortesting() {
    this.idDossier = 137;
    // this.idDossier = res.data[0]["idDossier"];
    this.dataPatient.dossierId = this.idDossier;
    this.dataPatient.weight = this.EcgForm.value.poids;
    this.dataPatient.doctorId = this.idUser;
    this.dataPatient.dThorasic = this.EcgForm.value.dThorasic;
    this.dataPatient.patientId = 78;
    this.dataPatient.etabId = this.idEtab;
    this.dataPatient.ecgImage = "107_1580293391.png";
    this.dataPatient.ecgAfficher = "107_1580293391.png";
    this.dataPatient.startAt = this.startAt;
    this.dataPatient.birthDay = "2017-01-28";
    this.dataPatient.birthDayFr = "28-01-2017";
    this.dataPatient.age = 3;
    console.log(" idDossier", this.idDossier);
    console.log(" dataPatient", this.dataPatient);
    this.router.navigate([
      "./insc-infos",
      this.idDossier,
      JSON.stringify(this.dataPatient)
    ]);
  }
  startUpload() {
    this.file
      .resolveLocalFilesystemUrl(this.imageData)
      .then(entry => {
        console.log("ok");
        (<FileEntry>entry).file(file => this.readFile(file));
      })
      .catch(err => {
        console.log("erreur");
        //this.presentToast("Error while reading file.");
      });
  }

  readFile(file: any) {
    console.log("readFile", file);
    const reader = new FileReader();
    reader.onload = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {
        type: file.type
      });
      let dThorasic = 0;
      this.EcgForm.value.dThorasic === true ? (dThorasic = 1) : (dThorasic = 0);

      console.log("idEtab", this.idEtab);
      console.log("idUser", this.idUser);
      console.log("dThorasic", dThorasic);
      console.log("token", this.token);

      formData.append("ecgImage", imgBlob, file.name);
      formData.append("etabId", this.idEtab.toString());
      formData.append("doctorId", this.idUser.toString());
      formData.append("dThorasic", dThorasic.toString());
      formData.append("weight", this.EcgForm.value.poids.toString());
      formData.append("stepId", this.stepId.toString());
      formData.append("patientId", this.idPatient.toString());
      formData.append("lastName", this.dataPatient["firstName"]);
      formData.append("firstName", this.dataPatient["lastName"]);
      formData.append("birthday", this.dataPatient["birthDay"]);
      formData.append("gender", this.gender.toString());
      this.uploadImageData(formData);
    };
    reader.readAsArrayBuffer(file);
  }

  async uploadImageData(formData: FormData) {
    console.log("uploadImageData", formData);
    const loading = await this.loadingController.create({
      message: "Uploading image..."
    });
    await loading.present();

    console.log("token", this.token);
    console.log("formData", formData);

    let headers = new HttpHeaders();
    // headers = headers.set('Content-Type', 'application/json');
    headers = headers.set("Authorization", "" + this.token);

    console.log("headers", headers);

    this.http
      .post("http://cardio.cooffa.shop/api/dossiers", formData, { headers })
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe((res: DossierResponseData) => {
        if (+res.code === 201) {
          console.log(" res", res.data);
          this.idDossier = res.data["dossierId"];
          //this.idDossier = res.data[0]["idDossier"];
          this.dataPatient.dossierId = this.idDossier;
          this.dataPatient.weight = this.EcgForm.value.poids;
          this.dataPatient.doctorId = this.idUser;
          this.dataPatient.dThorasic = this.EcgForm.value.dThorasic;
          this.dataPatient.patientId = this.idPatient;
          this.dataPatient.etabId = this.idEtab;
          this.dataPatient.ecgImage = res.data["ecgImage"];
          this.dataPatient.ecgAfficher = res.data["ecgImage"];
          this.dataPatient.startAt = this.startAt;
          this.dataPatient.birthDay = res.data["birthDay"];
          this.dataPatient.birthDayFr = res.data["birthDayFr"];
          this.dataPatient.age = res.data["age"];
          console.log(" idDossier", this.idDossier);
          console.log(" dataPatient", this.dataPatient);
          this.router.navigate([
            "./insc-infos",
            this.idDossier,
            JSON.stringify(this.dataPatient)
          ]);
          // this.presentToast("File upload complete.");
        } else {
          this.sglob.showAlert("Erreur ", "Erreur interne, veuillez réessayer");
        }
      });
  }

  deleteImage() {
    this.isEcg = false;
  }
  takePicture() {
    console.log("======n0=======");
    const options: CameraOptions = {
      quality: 75,
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
      this.ecgAfficher = this.sglob.pathForImage(imageData);
    });
  }
}
