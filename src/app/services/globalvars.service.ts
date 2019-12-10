import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";
@Injectable({
  providedIn: "root"
})
export class GlobalvarsService {
  public idUser;
  public token;
  constructor(private toastController: ToastController) {}

  public updateInfoUser(idUser, token) {
    this.idUser = idUser;
    this.token = token;
  }

  public get_IdUser() {
    return this.idUser;
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
