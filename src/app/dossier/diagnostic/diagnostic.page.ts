import { Component, OnInit } from "@angular/core";
import { ServiceAppService } from "src/app/services/service-app.service";
import { GlobalvarsService } from "src/app/services/globalvars.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DossierModel } from "src/app/models/dossier.model";

@Component({
  selector: "app-diagnostic",
  templateUrl: "./diagnostic.page.html",
  styleUrls: ["./diagnostic.page.scss"]
})
export class DiagnosticPage implements OnInit {
  idDossierToGet: number;
  dataPatients: Array<DossierModel>;
  hasHistoric = false;
  dataPatient: object;
  ecgTmp: string;
  idDossier: number;

  constructor(
    private srvApp: ServiceAppService,
    private sglob: GlobalvarsService,
    private activatedroute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedroute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("dataPatientObj")) {
        this.router.navigate(["/home"]);
      } else {
        const dataObj = paramMap.get("dataPatientObj");
        this.dataPatient = JSON.parse(dataObj)[0];
        console.log(
          " DIAGNOSTIC  recu diag >>>>> dataPatient ::: ",
          this.dataPatient
        );
      }

      if (!paramMap.has("idDossier")) {
        this.router.navigate(["/home"]);
      } else {
        this.idDossier = +paramMap.get("idDossier");
        this.ecgTmp = this.dataPatient["ecgTmp"];
      }
    });
  }

  // ===============  PUBLIC FUNCTIONS ===============
  onShowEcg() {
    console.log("::::::: Show Image ECG :::::::");
  }
  ras() {
    this.router.navigate([
      "./ras",
      this.idDossier,
      JSON.stringify(this.dataPatient)
    ]);
  }

  // getDataPatient(id: number) {
  //   console.log("************id==>", id);
  //   return {
  //     ...this.dataPatients.find(dossier => {
  //       return dossier["id_dossier"] === id;
  //     })
  //   };
  // }
}
