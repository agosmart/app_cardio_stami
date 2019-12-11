import { Component, OnInit } from "@angular/core";
import { ServiceAppService } from "../services/service-app.service";
import { GlobalvarsService } from "../services/globalvars.service";
import { Router } from "@angular/router";
import { DataDetailPatient } from "../models/data_detail_patient";

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
  objectPatient: Array<DataDetailPatient>;

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
          idPatient: 1,
          firsName: "Mohamed",
          lastName: "Mouallem",
          birthday: "14-07-1974",
          countDossier: 3
        },
        {
          idPatient: 2,
          firsName: "Mohamed",
          lastName: "Moualem",
          birthday: "14-07-1974",
          countDossier: 1
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
