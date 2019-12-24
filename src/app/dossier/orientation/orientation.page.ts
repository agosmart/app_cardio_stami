import { Component, OnInit } from "@angular/core";
import { ServiceAppService } from "src/app/services/service-app.service";
import { GlobalvarsService } from "src/app/services/globalvars.service";
import { ActivatedRoute, Router } from "@angular/router";
import {
  LoadingController,
  AlertController,
  ModalController
} from "@ionic/angular";
import { EtabResponseData } from "src/app/models/etab.response";

@Component({
  selector: "app-orientation",
  templateUrl: "./orientation.page.html",
  styleUrls: ["./orientation.page.scss"]
})
export class OrientationPage implements OnInit {
  idUser: number;
  idEtab: number;
  token: string;
  itemsCR: any;
  dataPatient: object;
  retunListeCR: EtabResponseData;

  constructor(
    private srvApp: ServiceAppService,
    private sglob: GlobalvarsService,
    private activatedroute: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private router: Router,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.idUser = this.sglob.getIdUser();
    this.idEtab = this.sglob.getidEtab();
    this.token = this.sglob.getToken();
    this.activatedroute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("dataPatientObj")) {
        // this.router.navigate(["/home"]);
      } else {
        const dataObj = paramMap.get("dataPatientObj");
        this.dataPatient = JSON.parse(dataObj);
        //this.objectInsc = JSON.parse(dataObj);
        console.log(" DIAGNOSTIC >>>>> dataPatients ::: ", this.dataPatient);
        console.log(
          " DIAGNOSTIC >>>>> dataPatients ::: ",
          this.dataPatient["lastName"]
        );
      }
      // if (!paramMap.has("idDossier")) {
      //   this.router.navigate(["/home"]);
      // } else {
      //   this.idDossier = +paramMap.get("idDossier");
      //   console.log(" DIAGNOSTIC >>>>> idDossier  halim ::: ", this.idDossier);
      //   this.ecgTmp = this.dataPatient["ecgTmp"];
      // }

      // 1 c les CR  2 CUDT
      this.srvApp.getListeCR(1).subscribe((resp: any) => {
        this.retunListeCR = resp;
        console.log("return liste cr", this.retunListeCR);
        console.log("return liste code", this.retunListeCR.code);
        // this.retunListeCR.code = 200; // a enlever
        if (+this.retunListeCR.code === 200) {
          this.itemsCR = this.retunListeCR.data;
          console.log("nom etab cr", this.retunListeCR.data);
        } else {
          console.log("no");
        }
      });
    });
  }

  callCr(idCr) {
    console.log("call cr", idCr);
  }
}
