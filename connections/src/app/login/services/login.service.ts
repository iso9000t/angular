import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environent';
import { LoginData, LoginResponse } from '../models/login.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private loginURL = `${environment.apiUrl}/login`;
  private logoutURL = `${environment.apiUrl}/logout`;

  constructor(private http: HttpClient) {}

  login(userData: LoginData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginURL, userData);
  }

  logout(): Observable<void> {
    return this.http.delete<void>(this.logoutURL);
  }
}
