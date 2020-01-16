import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-test",
  templateUrl: "./test.page.html",
  styleUrls: ["./test.page.scss"]
})
export class TestPage implements OnInit {
  urlhalim: string;

  constructor() {
    this.urlhalim = "http://cardio.cooffa.shop/show/ecg/38_1578912363.png";
  }

  ngOnInit() {}
}
