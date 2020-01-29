import { Component, OnInit } from "@angular/core";
import { SrvArchiveService } from "src/app/services/srv-archive.service";
import { GlobalvarsService } from "src/app/services/globalvars.service";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ModalController,
  LoadingController,
  ToastController,
  AlertController
} from "@ionic/angular";
import { Observable } from "rxjs";

@Component({
  selector: "app-detail-archive",
  templateUrl: "./detail-archive.page.html",
  styleUrls: ["./detail-archive.page.scss"]
})
export class DetailArchivePage implements OnInit {
  idDossier: number;
  token: string;
  idUser: number;
  dataPatient: object;
  constructor(
    private srvArchive: SrvArchiveService,
    private sglob: GlobalvarsService,
    private activatedroute: ActivatedRoute,
    private router: Router,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.token = this.sglob.getToken();
    this.idUser = this.sglob.getIdUser();
    this.activatedroute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("idDossier")) {
        this.router.navigate(["/home"]);
      } else {
        this.idDossier = +paramMap.get("idDossier");
        console.log("dosier archive", this.idDossier);
      }
    });
  }

  openImageEcg() {}
}
