import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  LoadingController,
  AlertController,
  ModalController,
  NavParams
} from "@ionic/angular";
import { DossierModel } from "src/app/models/dossier.model";

@Component({
  selector: "app-avis-med",
  templateUrl: "./avis-med.page.html",
  styleUrls: ["./avis-med.page.scss"]
})
export class AvisMedPage implements OnInit {
  crName: string;
  motifId: number;
  dataModalAvis: [];
  dataReponsesAvis: [];
  dataPatient: DossierModel;
  isLoading = false;
  constructor(
    private router: Router,
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) {}

  ngOnInit() {
    this.dataModalAvis = this.navParams.data.dataModalAvis;
    this.dataPatient = this.navParams.data.dataPatient;
    console.log("dataPatient===>", this.dataPatient);
    console.log("dataModalAvis===>", this.dataModalAvis);
    this.dataReponsesAvis = this.dataModalAvis["laReponse"];
    this.crName = this.dataModalAvis["etabName"];
    this.motifId = this.dataModalAvis["motifId"];
    console.log("dataReponsesAvis===>", this.dataReponsesAvis);
  }

  treatmentEngio() {
    console.log("dataPatient", this.dataPatient);
    this.router.navigate([
      "/treatment-engio",
      this.dataModalAvis["idDossier"],
      JSON.stringify(this.dataPatient),
      JSON.stringify(this.dataModalAvis)
    ]);

    this.modalCtrl.dismiss(true);
  }

  showAlertConfirme() {}
  closeModal() {
    this.modalCtrl.dismiss(true);
  }
}
