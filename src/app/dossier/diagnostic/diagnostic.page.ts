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

  constructor(
    private srvApp: ServiceAppService,
    private sglob: GlobalvarsService,
    private activatedroute: ActivatedRoute,
    private router: Router
  ) {
    this.idDossierToGet = 128;
    this.hasHistoric = true;
  }

  ngOnInit() {
    this.activatedroute.paramMap.subscribe(paramMap => {
      if (!paramMap.has("dataPatientObj")) {
        this.router.navigate(["/home"]);
      } else {
        const dataObj = paramMap.get("dataPatientObj");
        this.dataPatients = JSON.parse(dataObj);
        //this.objectInsc = JSON.parse(dataObj);
        console.log(" DIAGNOSTIC >>>>> dataPatients ::: ", this.dataPatients);
        console.log(
          " DIAGNOSTIC >>>>> dataPatients ::: ",
          this.dataPatients[0]["firstName"]
        );
      }

      if (!paramMap.has("idDossier")) {
        this.router.navigate(["/home"]);
      } else {
        const idDossier = +paramMap.get("idDossier");

        console.log(" DIAGNOSTIC >>>>> idDossier  halim ::: ", idDossier);
        this.dataPatient = this.getDataPatient(idDossier);
        console.log(
          " DIAGNOSTIC >>>>> getDataPatient() ::: ",
          this.dataPatient
        );
      }
    });
  }

  // ===============  PUBLIC FUNCTIONS ===============
  onShowEcg() {
    console.log("::::::: Show Image ECG :::::::");
  }

  // getDataPatient(id: number) {
  //   console.log("id==>", id);
  //   return {
  //     ...this.dataPatients.find((dossier: DossierModel) => {
  //       return dossier.id_dossier;
  //     })
  //   };
  // }

  getDataPatient(id: number) {
    console.log("************id==>", id);
    return {
      ...this.dataPatients.find(dossier => {
        return dossier["id_dossier"] === id;
      })
    };
  }
}
