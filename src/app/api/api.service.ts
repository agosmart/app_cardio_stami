import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
      Accept: 'application/json',
    });
    const myBody: any = params; // username / password
    return this.http.post(apiUrl, myBody, { headers: myHeaders });
  }

  registerDoctor(params: object) {
    const apiUrl = this.baseUrl + '/register';
    const myHeaders: HttpHeaders = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });

    const myBody: any = params; // username / password
    return this.http.post(apiUrl, myBody, { headers: myHeaders });

  }
}
