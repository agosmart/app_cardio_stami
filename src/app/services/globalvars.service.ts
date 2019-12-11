import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";
@Injectable({
  providedIn: "root"
})
export class GlobalvarsService {
  private idUser;
  private token;
  private idEtab;
  constructor(private toastController: ToastController) {}

  public updateInfoUser(idUser, token, idEtab) {
    this.idUser = idUser;
    this.token = token;
  }

  public getIdUser() {
    return this.idUser;
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
}
