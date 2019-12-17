import { Component, OnInit } from "@angular/core";
import { ServiceAppService } from "src/app/services/service-app.service";
import { GlobalvarsService } from "src/app/services/globalvars.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DossierModel } from "src/app/models/dossier.model";

@Component({
  selector: "app-ras",
  templateUrl: "./ras.page.html",
  styleUrls: ["./ras.page.scss"]
})
export class RasPage implements OnInit {
  idDossierToGet: number;
  dataPatients: Array<DossierModel>;
  hasHistoric = false;
  dataPatient: object;
  ecgTmp: string;

  constructor(
    private srvApp: ServiceAppService,
    private sglob: GlobalvarsService,
    private activatedroute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // this.activatedroute.paramMap.subscribe(paramMap => {
    //   if (!paramMap.has("dataPatientObj")) {
    //     this.router.navigate(["/home"]);
    //   } else {
    //     const dataObj = paramMap.get("dataPatientObj");
    //     this.dataPatients = JSON.parse(dataObj);
    //     //this.objectInsc = JSON.parse(dataObj);
    //     console.log(" DIAGNOSTIC >>>>> dataPatients ::: ", this.dataPatients);
    //     console.log(
    //       " DIAGNOSTIC >>>>> dataPatients ::: ",
    //       this.dataPatients["prenom_patient"]
    //     );
    //   }
    //   if (!paramMap.has("idDossier")) {
    //     this.router.navigate(["/home"]);
    //   } else {
    //     const idDossier = +paramMap.get("idDossier");
    //     console.log(" DIAGNOSTIC >>>>> idDossier  halim ::: ", idDossier);
    //     this.dataPatient = this.getDataPatient(idDossier);
    //     console.log(
    //       " DIAGNOSTIC >>>>> getDataPatient() ::: ",
    //       this.dataPatient
    //     );
    //     this.ecgTmp = this.dataPatient["ecgTmp"];
    //   }
    // });
  }
}
