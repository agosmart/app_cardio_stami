import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";
import { WebView } from "@ionic-native/ionic-webview/ngx";
@Injectable({
  providedIn: "root"
})
export class GlobalvarsService {
  private idUser;
  private token;
  private idEtab;
  private initFetch = false;
  constructor(
    private toastController: ToastController,
    private webview: WebView
  ) {}

  public updateInfoUser(idUser, token, idEtab) {
    this.idUser = idUser;
    this.token = token;
    this.idEtab = idEtab;
  }

  public updateInitFetchHome(initFetch) {
    this.initFetch = initFetch;
  }

  public getIdUser() {
    return this.idUser;
  }

  public getInitFetch() {
    return this.initFetch;
  }

  public getToken() {
    return this.token;
  }

  public getidEtab() {
    return this.idEtab;
  }
  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      position: "bottom",
      duration: 3000
    });
    toast.present();
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
