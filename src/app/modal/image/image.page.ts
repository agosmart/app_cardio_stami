import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { ModalController, NavParams } from "@ionic/angular";

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

  constructor(
    private navParams: NavParams,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.img = this.navParams.get("value");
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
