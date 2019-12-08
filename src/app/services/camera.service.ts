import { Injectable } from "@angular/core";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";

@Injectable({
  providedIn: "root"
})
export class CameraService {
  public base64Image: string;
  options: CameraOptions = {
    quality: 100,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  };
  constructor(private camera: Camera) {}

  GetEggPicture() {
    console.log("service camera.....");
    this.camera.getPicture(this.options).then(
      imageData => {
        // imageData is either a base64 encoded string or a file URI
        // If it's base64 (DATA_URL):
        this.base64Image = "data:image/jpeg;base64," + imageData;
        console.log("ds le service", this.base64Image);
        return this.base64Image;
      },
      err => {
        // Handle error
      }
    );
  }
}
