import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  loaderToShow: any;

  isLoading = false;

  constructor(public loadingController: LoadingController) { }

  showLoader(messageLoad) {
    this.loaderToShow = this.loadingController.create({
      message: messageLoad
    }).then((res) => {
      res.present();
    });
  }

  hideLoader() {
    setTimeout(() => {
      this.loadingController.dismiss();
    }, 1000);
  }


}
