import { Component, OnInit } from '@angular/core';
import { ServiceAppService } from 'src/app/services/service-app.service';
import { GlobalvarsService } from 'src/app/services/globalvars.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-diagnostic',
  templateUrl: './diagnostic.page.html',
  styleUrls: ['./diagnostic.page.scss'],
})
export class DiagnosticPage implements OnInit {


  idDossierToGet: number;
  dataPatient: object;
  hasHistoric = false;


  constructor(
    private srvApp: ServiceAppService,
    private sglob: GlobalvarsService,
    private activatedroute: ActivatedRoute,
    private router: Router,
  ) {
    this.idDossierToGet = 128;
    this.hasHistoric = true;
  }

  ngOnInit() {

    this.activatedroute.paramMap.subscribe(paramMap => {
      if (!paramMap.has('dataPatientObj')) {
        return;
      } else {

        const dataObj = paramMap.get('dataPatientObj');
        this.dataPatient = JSON.parse(dataObj);

        console.log(' DIAGNOSTIC >>>>> dataPatient ::: ', this.dataPatient);

      }
    });
  }


   // ===============  PUBLIC FUNCTIONS ===============
   onShowEcg() {
    console.log('::::::: Show Image ECG :::::::');
  }


}
