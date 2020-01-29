import { Component, OnInit } from "@angular/core";
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { Platform, NavController } from "@ionic/angular";
import { GlobalvarsService } from "../services/globalvars.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-onboard",
  templateUrl: "./onboard.page.html",
  styleUrls: ["./onboard.page.scss"]
})
export class OnboardPage implements OnInit {
  affichePub: boolean;
  constructor(
    public navcrtl: NavController,
    private nat: NativeStorage,
    private plt: Platform,
    private sglob: GlobalvarsService,
    private router: Router
  ) {
    // this.deleteStore();
    this.affichePub = false;
    this.plt.ready().then(() => {
      this.getItems();
    });
  }

  ngOnInit() {}

  public skiping() {}
  getItems() {
    this.nat.getItem("cardio").then(
      data => this.goToHome(data),
      error => (this.affichePub = true)
    );
  }
  goToLogin() {
    this.router.navigate(["login"]);
  }

  goToHome(data: any) {
    /*idUser: 95, token: "mqKcny0Mmk9zXqPXJLr0n8uZ8yNUnxZzyYNTKVatuErUuXzgyxg45wdxrB20", idEtab: 3}
idEtab: 3
idUser: 95
token: "mqKcny0Mmk9zXqPXJLr0n8uZ8yNUnxZzyYNTKVatuErUuXzgyxg45wdxrB20"
    console.log("idEtab", data.idEtab);
    console.log("idUser", data.IdUser);
    console.log("token", data.token);

    console.log("data", data);*/

    this.sglob.updateInfoUser(data.idUser, data.token, data.idEtab);
    this.router.navigate(["home"]);
  }

  deleteStore() {
    this.nat.remove("cardio");
  }
}
