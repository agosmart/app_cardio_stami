import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthResponseData } from "../models/auth.response";
@Injectable({
  providedIn: "root"
})
export class UserService {
  baseUrl = "http://cardio.cooffa.shop/api";

  //baseUrl2 = "http://41.110.24.164";
  constructor(public http: HttpClient) {}

  loginDoctor(params: object) {
    const apiUrl = this.baseUrl + "/login";
    const myHeaders: HttpHeaders = new HttpHeaders({
      Accept: "application/json"
    });
    const myBody: any = params; // username / password
    return this.http.post<AuthResponseData>(apiUrl, myBody, {
      headers: myHeaders
    });
  }

  registerDoctor(params: object) {
    const apiUrl = this.baseUrl + "/register";
    const myHeaders: HttpHeaders = new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/json"
    });

    const myBody: object = params;
    console.log("PARAMS :::", myBody);
    return this.http.post<AuthResponseData>(apiUrl, myBody, {
      headers: myHeaders
    });
  }
}
