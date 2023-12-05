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
  constructor(private http: HttpClient) {}

  login(userData: LoginData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginURL, userData);
  }
}
