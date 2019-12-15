import { Component, OnInit } from "@angular/core";
import { ServiceAppService } from "../services/service-app.service";
import { GlobalvarsService } from "../services/globalvars.service";
import { Router } from "@angular/router";
import { PatientModel } from "../models/patient.model";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage implements OnInit {
  IdUser: number;
  idEtab: number;
  token: string;
  isExistDossier: boolean;
  objectPatient: Array<PatientModel>;

  constructor(
    private srv: ServiceAppService,
    private sglob: GlobalvarsService,
    private router: Router
  ) {
    this.isExistDossier = true;
    this.IdUser = this.sglob.getIdUser();
    this.token = this.sglob.getToken();
    this.idEtab = this.sglob.getidEtab();
    console.log("user med", this.IdUser);
  }

  ngOnInit() {
    if (this.isExistDossier) {
      this.objectPatient = [


        {
          id: 1,
          nom: "Mohamed",
          prenom: "Mouallem",
          gender: 2,
          birthday: "14-07-1974",
          qrcode: null,
          cudt: "kouba",


        },
        {
          id: 2,
          nom: "Maachi",
          prenom: "halim",
          birthday: "14-07-1960",
          gender: 2,
          qrcode: "998877665544332211",
          cudt: "H.day",
        }
      ];
      console.log("objectPatient :::>", this.objectPatient);
    }
  }

  goToAddDossier() {
    console.log("go to add");
    this.router.navigate(["inscription"]);
  }
}
