import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
//import { Observable } from'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { ArchiveResponseData } from "../models/archive.response";

@Injectable({
  providedIn: "root"
})
export class SrvArchiveService {
  baseUrl = "http://cardio.cooffa.shop/api";

  constructor(public http: HttpClient) {}

  public getDossierPatient(idPatient: number, token: string): any {
    console.log("token service ===>", token);
    const apiUrl = this.baseUrl + "/patients/" + idPatient;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + token
    });
    return this.http.get<ArchiveResponseData>(apiUrl, {
      headers: myHeaders
    });
  }
}
