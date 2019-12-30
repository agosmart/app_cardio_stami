import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Http } from "@angular/http";
import { File, FileEntry } from "@ionic-native/file/ngx";
import {
  FileTransfer,
  FileUploadOptions,
  FileTransferObject
} from "@ionic-native/file-transfer/ngx";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { PatientResponseData } from "src/app/models/patient.response";
import { DossierResponseData } from "src/app/models/dossier.response";
import { finalize } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class UploadFileService {
  idDossier: number;
  constructor(
    private file: File,
    private router: Router,
    private transfer: FileTransfer,
    private activatedroute: ActivatedRoute,
    public http: HttpClient
  ) {}

  startUpload(imageData, token, dataPatient) {
    this.file
      .resolveLocalFilesystemUrl(imageData)
      .then(entry => {
        console.log("ok");
        (<FileEntry>entry).file(file =>
          this.readFile(file, imageData, token, dataPatient)
        );
      })
      .catch(err => {
        console.log("erreur");
        //this.presentToast("Error while reading file.");
      });
  }

  readFile(file: any, imageData, token, dataPatient) {
    console.log("readFile", file);
    const reader = new FileReader();
    reader.onload = () => {
      const formData = new FormData();
      const imgBlob = new Blob([reader.result], {
        type: file.type
      });
      formData.append("ecgImage", imgBlob, file.name);
      formData.append("etabId", dataPatient["idEtab"].toString());
      formData.append("doctorId", dataPatient["doctorId"].toString());
      formData.append("dThorasic", dataPatient["dThorasic"]);
      formData.append("weight", dataPatient["weight"].toString());
      formData.append("stepId", "4");
      formData.append("patientId", dataPatient["patientId"].toString());
      formData.append("lastName", dataPatient["firstName"]);
      formData.append("firstName", dataPatient["lastName"]);
      formData.append("birthday", dataPatient["birthDay"]);
      formData.append("gender", dataPatient["gender"].toString());

      this.uploadImageData(formData, imageData, token, dataPatient);
    };
    reader.readAsArrayBuffer(file);
  }

  async uploadImageData(formData: FormData, imageData, token, dataPatient) {
    console.log("uploadImageData", formData);
    // const loading = await this.loadingController.create({
    //   message: "Uploading image..."
    // });
    // await loading.present();

    let headers = new HttpHeaders();
    // headers = headers.set('Content-Type', 'application/json');
    headers = headers.set("Authorization", "" + token);

    this.http
      .post("http://cardio.cooffa.shop/api/dossiers", formData, { headers })
      .pipe(
        finalize(() => {
          //loading.dismiss();
        })
      )
      .subscribe((res: DossierResponseData) => {
        if (+res.code === 201) {
          this.idDossier = res.data[0]["idDossier"];
          this.router.navigate([
            "./insc-infos",
            this.idDossier,
            JSON.stringify([dataPatient])
          ]);
          // this.presentToast("File upload complete.");
        } else {
          console.log("erreur");
          /// this.presentToast("File upload failed.");
        }
      });
  }
}
