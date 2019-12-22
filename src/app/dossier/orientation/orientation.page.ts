import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orientation',
  templateUrl: './orientation.page.html',
  styleUrls: ['./orientation.page.scss'],
})
export class OrientationPage implements OnInit {
  dataPatient: object;


  constructor() {
    this.dataPatient = {
      lastName: "mamadou",
      firstName: "Touré",
      gender: "2",
      birthDay: "1960-02-15"
    };
   }

  ngOnInit() {


    
  }

}
