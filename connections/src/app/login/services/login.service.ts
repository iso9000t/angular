import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environment/environent';
import { LoginData } from '../models/login.model';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private http: HttpClient) {}

  login(userData: LoginData) {
    return this.http.post(`${environment.apiUrl}/login`, userData);
  }
}
