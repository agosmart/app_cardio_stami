import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ServiceAppService } from "src/app/services/service-app.service";
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
  stapeId = 4; // etape Infos Dossier

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

  // without upload
  submitEcg() {
    if (!this.isEcg) {
      this.idDossier = 200;
      this.imageData = "file:/";
      this.ecgAfficher = "http:/";
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
      this.router.navigate([
        "./insc-infos",
        this.idDossier,
        JSON.stringify([this.dataPatient])
      ]);
      //this.upload();
      //this.uploadImageData();
      //this.startUpload();
    } else {
      console.log("===== veuiller faire un ECG====");
    }
  }
  submitEcg___withupload() {
    if (this.isEcg) {
      // this.idDossier = 115;
      // this.imageData = "file:/";
      // this.ecgAfficher = "http:/";
      // this.dataPatient.dossierId = this.idDossier;
      // this.dataPatient.weight = this.EcgForm.value.poids;
      // this.dataPatient.doctorId = this.idUser;
      // this.dataPatient.dThorasic = this.EcgForm.value.dThorasic;
      // this.dataPatient.patientId = this.idPatient;
      // this.dataPatient.etabId = this.idEtab;
      // this.dataPatient.ecgImage = this.imageData;
      // this.dataPatient.ecgAfficher = this.ecgAfficher;
      // this.dataPatient.startAt = "13:25:00";

      // console.log("===== dataPatient envoye ===", this.dataPatient);
      // this.sglob.presentToast("Données envoyés avec succès.");
      // this.router.navigate([
      //   "./insc-infos",
      //   this.idDossier,
      //   JSON.stringify(this.dataPatient)
      // ]);
      //this.upload();
      //this.uploadImageData();
      this.startUpload();
    } else {
      console.log("===== veuiller faire un ECG====");
    }
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
      formData.append("ecgImage", imgBlob, file.name);
      formData.append("etabId", this.idEtab.toString());
      formData.append("doctorId", this.idUser.toString());
      formData.append("dThorasic", this.EcgForm.value.dThorasic);
      formData.append("weight", this.EcgForm.value.poids.toString());
      formData.append("stapeId", this.stapeId.toString());
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
    // const loading = await this.loadingController.create({
    //   message: "Uploading image..."
    // });
    // await loading.present();

    let headers = new HttpHeaders();
    // headers = headers.set('Content-Type', 'application/json');
    headers = headers.set("Authorization", "" + this.token);

    this.http
      .post("http://cardio.cooffa.shop/api/dossiers", formData, { headers })
      .pipe(
        finalize(() => {
          //loading.dismiss();
        })
      )
      .subscribe((res: DossierResponseData) => {
        if (+res.code === 201) {
          console.log(" res", res.data);
          // this.presentToast("File upload complete.");
        } else {
          console.log("erreur");
          /// this.presentToast("File upload failed.");
        }
      });
  }

  deleteImage() {
    this.isEcg = false;
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
      this.ecgAfficher = this.sglob.pathForImage(imageData);
    });
  }
}
