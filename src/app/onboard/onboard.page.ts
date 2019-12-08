import { Component, OnInit } from "@angular/core";
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { Platform, NavController } from "@ionic/angular";
import { GlobalvarsService } from "../services/globalvars.service";

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
    private p1: Platform,
    private sglob: GlobalvarsService
  ) {
    // this.DeleteStore();
    this.affichePub = false;
    this.p1.ready().then(() => {
      this.GetItems();
    });
  }

  ngOnInit() {}

  public skiping() {}
  GetItems() {
    this.nat.getItem("cardio").then(
      data => this.GoToHome(data),
      error => (this.affichePub = true)
    );
  }
  GoToLogin() {
    this.navcrtl.navigateRoot("login");
  }

  GoToHome(data) {
    this.sglob.update_IdUser(data.IdUser);
    this.navcrtl.navigateRoot("home");
  }

  DeleteStore() {
    this.nat.remove("cardio");
  }
}
