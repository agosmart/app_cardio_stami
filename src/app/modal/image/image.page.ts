import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { ModalController, NavParams, LoadingController } from "@ionic/angular";

@Component({
  selector: "app-image",
  templateUrl: "./image.page.html",
  styleUrls: ["./image.page.scss"]
})
export class ImagePage implements OnInit {
  @ViewChild("slider", { read: ElementRef, static: false }) slider: ElementRef;
  img: any;
  sliderOpts = {
    zoom: {
      maxRatio: 5
    }
  };
  isLoaded: boolean;
  intr: any;

  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private loadingCtrl: LoadingController
  ) {
    this.isLoaded = false;
  }

  ngOnInit() {
    this.img = this.navParams.get("value");
    console.log("IMAGE IS LOASED 0", this.isLoaded);
    this.presentLoadingWithOptions();
  }

  zoom(zoomIn: boolean) {
    //const zoom = this.slider.nativeElement.swiper.zoom;
    if (zoomIn) {
      //zoom.in();
      this.slider.nativeElement.swiper.zoom.in();
    } else {
      //  zoom.out();
      this.slider.nativeElement.swiper.zoom.out();
    }
  }

  close() {
    this.modalController.dismiss();
  }

  async presentLoadingWithOptions() {
    const loading = await this.loadingCtrl.create({
      spinner: "bubbles",
      duration: 5000,
      // showBackdrop :true,
      message: "Chargement en cours...",
      translucent: true,
      cssClass: "custom-class custom-loading"
    });
    await loading.present().then(_ => {
      this.init(loading);
    });
  }

  init(loading: any) {
    const thisIs = this;
    thisIs.intr = setInterval(function() {
      console.log("IMAGE IS LOASED 3 :", thisIs.isLoaded);
      if (thisIs.isLoaded) {
        thisIs.stopInit(loading);
      }
    }, 300);

    return thisIs.intr;
  }

  stopInit(loading: any) {
    console.log("IMAGE IS LOASED 4 :", this.isLoaded);
    clearInterval(this.intr);
    loading.dismiss();
  }
  onLoaded() {
    this.isLoaded = true;
    console.log("IMAGE IS LOASED 1", this.isLoaded);
  }

  // @ViewChild('slider', { read: ElementRef, static: true }) slider: ElementRef;

  // sliderOpts = {
  //   zoom: {
  //     maxRatio: 3,
  //   }
  // };

  // constructor(
  //   private navParams: NavParams,
  //   private modalCtrl: ModalController,
  //   private sanitizer: DomSanitizer
  // ) { }

  // ngOnInit() {
  //   // this.image = this.sanitizer.bypassSecurityTrustStyle(this.value);
  //   this.image = this.navParams.get('value');
  // }
  // // ngAfterViewInit() {

  // // }

  // zoom(zoomIn: boolean) {
  //   console.log('zoomIn:::', zoomIn);
  //   const zoom = this.slider.nativeElement.swiper.zoom;
  //   if (zoomIn) {
  //     zoom.in();
  //   } else {
  //     zoom.out();
  //   }
  //   // zoom.in();
  // }

  // closeModal() {
  //   this.modalCtrl.dismiss();
  // }
}
