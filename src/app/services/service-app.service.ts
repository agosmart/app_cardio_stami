import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { StandarReturnModel } from '../models/StandarReturnMdel';
import { PatientModel } from '../models/patient_model';
import { Md5 } from 'ts-md5/dist/md5';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ServiceAppService {
  private BaseUrl = 'http://41.110.24.164/cooffa/sante/';
  private apiKey =
    'b5e584c61-**--d@060357f33036@6412d16b30d1?cf47828f7f07fd6015a60d7';

  constructor(private http: Http) {}

  extras: any;
  public setExtras(data) {
    this.extras = data;
  }

  public getExtras() {
    return this.extras;
  }

  public login(form): any {
    const md5 = new Md5();
    const md5Password = md5.appendStr(form.password).end();
    const url = `${this.BaseUrl}login.php?password=${md5Password}&username=${form.username}&apiKey=${this.apiKey}`;

    return this.http
      .get(url)
      .toPromise()
      .then(response => response.json() as StandarReturnModel)
      .catch(error => console.log('Une erreur est survenue ' + error));
  }

  public Inscription( registrationForm): any {
    const md5 = new Md5();
    const md5Password = md5.appendStr(registrationForm.password).end();
    const url = `${this.BaseUrl}inscription.php?nom=${registrationForm.nom}&prenom=${registrationForm.prenom}&mobile=${registrationForm.mobile}&password=${md5Password}&username=${registrationForm.username}&cr=${registrationForm.cr}&cudt=${registrationForm.cudt}&gender=${registrationForm.civilite}&apiKey=${this.apiKey}`;

    return this.http
      .get(url)
      .toPromise()
      .then(response => response.json() as StandarReturnModel)
      .catch(error => console.log('Une erreur est survenue ' + error));
  }

  public addToken(token, IdUser): any {
    const url = `${this.BaseUrl}token.php?IdUser=${IdUser}&token=${token}&apiKey=${this.apiKey}`;

    return this.http
      .get(url)
      .toPromise()
      .then(response => response.json() as StandarReturnModel)
      .catch(error => console.log('Une erreur est survenue ' + error));
  }
  public getListeCR(): any {
    const url = `${this.BaseUrl}liste_cr.php?apiKey=${this.apiKey}`;

    return this.http
      .get(url)
      .toPromise()
      .then(response => response.json() as StandarReturnModel)
      .catch(error => console.log('Une erreur est survenue ' + error));
  }
  public getListeCudtByCR(idCr): any {
    const url = `${this.BaseUrl}liste_cudt.php?idCr=${idCr}&apiKey=${this.apiKey}`;

    return this.http
      .get(url)
      .toPromise()
      .then(response => response.json() as StandarReturnModel)
      .catch(error => console.log('Une erreur est survenue ' + error));
  }

 

  public getPatient(form): any {
    const url = `${this.BaseUrl}getpatient.php?nom=${form.nom}&genre=${form.genre}&datenaissance=${form.dateNaissance}&apiKey=${this.apiKey}`;
    console.log('url ==>', url);
    return this.http
      .get(url)
      .toPromise()
      .then(response => response.json() as PatientModel)
      .catch(error => console.log('Une erreur est survenue ' + error));
  }
}
