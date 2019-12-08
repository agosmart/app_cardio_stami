import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";
@Injectable({
  providedIn: "root"
})
export class GlobalvarsService {
  public IdUser = 0;
  constructor(private toastController: ToastController) {}

  public update_IdUser(IdUser) {
    this.IdUser = IdUser;
  }

  public get_IdUser() {
    return this.IdUser;
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
