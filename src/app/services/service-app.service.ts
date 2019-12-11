import { Injectable } from "@angular/core";
import { Http } from "@angular/http";
import { PatientModel } from "../models/patient_model";
import { Md5 } from "ts-md5/dist/md5";
//import { Observable } from'rxjs';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthResponseData } from "../models/auth.response";
import { DataListeEtab } from "../models/data_liste_etab";

interface ResponseEtab {
  code: number;
  data: DataListeEtab;
  message: string;
}

@Injectable({
  providedIn: "root"
})
export class ServiceAppService {
  //baseUrl ='http://41.110.24.164/cooffa/sante/';
  baseUrl = "http://cardio.cooffa.shop/api";

  private apiKey =
    "b5e584c61-**--d@060357f33036@6412d16b30d1?cf47828f7f07fd6015a60d7";

  extras: any;
  public setExtras(data) {
    this.extras = data;
  }

  public getExtras() {
    return this.extras;
  }
  //********************************** */

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
  /*************************************** */
  // public login(form): any {
  //   const md5 = new Md5();
  //   const md5Password = md5.appendStr(form.password).end();
  //   const url = `${this.BaseUrl}login.php?password=${md5Password}&username=${form.username}&apiKey=${this.apiKey}`;

  //   return this.http
  //     .get(url)
  //     .toPromise()
  //     .then(re
  // sponse => response.json() as StandarReturnModel)
  //     .catch(error => console.log('Une erreur est survenue' + error));
  // }

  // public Inscription(registrationForm): any {
  //   const md5 = new Md5();
  //   const md5Password = md5.appendStr(registrationForm.password).end();
  //   const url = `${this.BaseUrl}inscription.php?nom=${registrationForm.nom}&prenom=${registrationForm.prenom}&mobile=${registrationForm.mobile}&password=${md5Password}&username=${registrationForm.username}&cr=${registrationForm.cr}&cudt=${registrationForm.cudt}&gender=${registrationForm.civilite}&apiKey=${this.apiKey}`;

  //   return this.http
  //     .get(url)
  //     .toPromise()
  //     .then(response => response.json() as StandarReturnModel)
  //     .catch(error => console.log("Une erreur est survenue" + error));
  // }

  // public addToken(uid, idUser, mobile): any {
  //   const url = `${this.baseUrl}token.php?idUser=${idUser}&uid=${uid}`;

  //   return this.http
  //     .get(url)
  //     .toPromise()
  //     .then(response => response.json() as StandarReturnModel)
  //     .catch(error => console.log("Une erreur est survenue" + error));
  // }

  addToken(token, idUser, mobile) {}

  getListeCR(params: number) {
    const apiUrl = this.baseUrl + "/etablissements/" + params;
    const myHeaders: HttpHeaders = new HttpHeaders({
      Accept: "application/json"
    });
    const myBody: any = params; // username / password
    return this.http.get<ResponseEtab>(apiUrl, {
      headers: myHeaders
    });
  }
  // onchange
  public getListeCudtByCR(idCr): any {
    /*    const url = `${this.baseUrl}liste_cudt.php?idCr=${idCr}&apiKey=${this.apiKey}`;

    return this.http
      .get(url)
      .toPromise()
      .then(response => response.json() as StandarReturnModel)
      .catch(error => console.log("Une erreur est survenue" + error));
      */
  }

  public getPatient(form): any {
    // const url = `${this.baseUrl}getpatient.php?nom=${form.nom}&genre=${form.genre}&datenaissance=${form.dateNaissance}&apiKey=${this.apiKey}`;
    // console.log("url ==>", url);
    // return this.http
    //   .get(url)
    //   .toPromise()
    //   .then(response => response.json() as PatientModel)
    //   .catch(error => console.log("Une erreur est survenue" + error));
  }
}
