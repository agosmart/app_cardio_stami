import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class GlobalvarsService {
  public idUser = 0;
  constructor(private toastController: ToastController) { }

  public updateIdUser( idUser ) {
    this.idUser = idUser;
  }

  public get_IdUser() {
    return this.idUser;
  }
  async presentToast( text ) {
    const toast = await this.toastController.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });
    toast.present();
  }
}
