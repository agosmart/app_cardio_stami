import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-pretreatment',
  templateUrl: './pretreatment.page.html',
  styleUrls: ['./pretreatment.page.scss'],
})
export class PretreatmentPage implements OnInit {


  get bolus() {
    return this.pretreatmentFormInfos.get("bolus");
  }
  get aspegic() {
    return this.pretreatmentFormInfos.get("aspegic");
  }
  get plavix() {
    return this.pretreatmentFormInfos.get("plavix");
  }
  get heparine() {
    return this.pretreatmentFormInfos.get("heparine");
  }
  get enoxaparine() {
    return this.pretreatmentFormInfos.get("enoxaparine");
  }
  pretreatmentFormInfos = this.formBuilder.group({
    bolus: ["", [Validators.nullValidator]],
    aspegic: ["", [Validators.nullValidator]],
    plavix: ["", [Validators.nullValidator]],
    heparine: ["", [Validators.nullValidator]],
    enoxaparine: ["", [Validators.nullValidator]],

  });
  /* ------------------------*/
  constructor(
    private formBuilder: FormBuilder,
    // private srvApp: ServiceAppService,
    // private sglob: GlobalvarsService,
    // private activatedroute: ActivatedRoute,
    // private router: Router,
    // private loadingCtrl: LoadingController,
    // private alertCtrl: AlertController,
    // private modalCtrl: ModalController,
  ) { }


  ngOnInit() {
  }

  submitFormInfos() {

  }

}
