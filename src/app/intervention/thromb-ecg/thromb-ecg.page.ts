import { Component, OnInit } from "@angular/core";
import { ServiceAppService } from "src/app/services/service-app.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { GlobalvarsService } from "src/app/services/globalvars.service";
import { LoadingController, AlertController } from "@ionic/angular";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { File, FileEntry } from "@ionic-native/file/ngx";
import { LoadingService } from "src/app/services/loading.service";
import { finalize } from "rxjs/operators";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer/ngx";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { DossierModel } from "src/app/models/dossier.model";
import { DossierResponseData } from "src/app/models/dossier.response";

@Component({
  selector: "app-thromb-ecg",
  templateUrl: "./thromb-ecg.page.html",
  styleUrls: ["./thromb-ecg.page.scss"]
})
export class ThrombEcgPage implements OnInit {
  idUser: number;
  token: string;
  dossierId: number;
  typeId: number;
  doctorId: number;
  isEcg: boolean;
  ecgAfficher: string;
  imageData: any;
  //dataPatient: object;
  dataPatient: DossierModel;
  constructor(
    private srvApp: ServiceAppService,
    private sglob: GlobalvarsService,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public loading: LoadingService,
    private srv: ServiceAppService,
    private camera: Camera,
    private file: File,
    private transfer: FileTransfer,
    public http: HttpClient,
    public loadingController: LoadingController
  ) {}

  ngOnInit() {
    // this.hypertentionValue = 0;

    this.idUser = this.sglob.getIdUser();
    this.token = this.sglob.getToken();

    this.activatedroute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("dataPatientObj")) {
        // this.router.navigate(['/home']);
      } else {
        const dataObj = paramMap.get("dataPatientObj");
        this.dataPatient = JSON.parse(dataObj);
        this.doctorId = this.dataPatient["doctorId"];
        this.dossierId = this.dataPatient["dossierId"];
        if (this.dataPatient["stepId"] !== 14) {
          this.updateStep();
        }
      }
    });
  }

  updateStep() {
    console.log("update step");
    const params = {
      dossierId: this.dossierId,
      //resultatId: this.resultatId,
      stepId: 14
    };

    const authObs: Observable<DossierResponseData> = this.srvApp.updateStep(
      params,
      this.token
    );
    authObs.subscribe(
      resData => {
        if (+resData.code === 200) {
        } else {
          // ----- Hide loader ------
        }
      },

      // ::::::::::::  ON ERROR ::::::::::::
      errRes => {
        console.log(errRes);
        // ----- Hide loader ------
        // --------- Show Alert --------

        if (errRes.error.code === "401") {
          this.showAlert(errRes.error.message);
        } else {
          this.showAlert(
            "Prblème d'accès au réseau, veillez vérifier votre connexion"
          );
        }
      }
    );
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

  valider() {
    console.log(" test ===========>isEcg");
    if (this.isEcg) {
      console.log("isEcg");
      this.startUpload();
    } else {
      console.log(" not isEcg");
      this.showAlert("veuiller faire un ECG");
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

      const stepId = 17;
      formData.append("ecgImage", imgBlob, file.name);
      formData.append("dossierId", this.dossierId.toString());
      formData.append("doctorId", this.idUser.toString());
      formData.append("stepId", stepId.toString());
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

    let headers = new HttpHeaders();
    // headers = headers.set('Content-Type', 'application/json');
    headers = headers.set("Authorization", "" + this.token);

    this.http
      .post("http://cardio.cooffa.shop/api/ecgs", formData, { headers })
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe((res: DossierResponseData) => {
        if (+res.code === 201) {
          console.log(" res", res.data);
          this.dataPatient.ecgImage = this.imageData;
          this.dataPatient.ecgAfficher = this.ecgAfficher;
          this.router.navigate([
            "./thromb-protoc",
            this.dossierId,
            JSON.stringify(this.dataPatient)
          ]);
          // this.presentToast("File upload complete.");
        } else {
          console.log("erreur");
          this.showAlert("Erreur interne, veuillez réessayer");
          /// this.presentToast("File upload failed.");
        }
      });
  }

  private showAlert(message: string) {
    this.alertCtrl

      .create({
        header: "Résultat d'authentication",
        message: message,
        cssClass: "alert-css",
        buttons: ["Okay"]
      })
      .then(alertEl => alertEl.present());
  }
}
