import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../models/user.model';


// ----------- RESPONSE MODEL-------------------
export interface AuthResponseData {
  code: number;
  data: UserModel;
  message?: string;
}
// ------------------------------
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = 'http://cardio.cooffa.shop/api';

  constructor(
    public http: HttpClient,
  ) { }

  loginDoctor(params: object) {
    const apiUrl = this.baseUrl + '/login';
    const myHeaders: HttpHeaders = new HttpHeaders({
      'Accept': 'application/json',
    });
    const myBody: any = params; // username / password
    return this.http.post<AuthResponseData>(apiUrl, myBody, { headers: myHeaders });
  }

  registerDoctor(params: object) {
    const apiUrl = this.baseUrl + '/register';
    const myHeaders: HttpHeaders = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    });

    const myBody: object = params;
    console.log('PARAMS :::', myBody )
    return this.http.post<AuthResponseData>(apiUrl, myBody, { headers: myHeaders });

  }
}
