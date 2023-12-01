import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegistrationData } from '../registration/models/registration.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  register(userData: RegistrationData) {
    return this.http.post(
      'https://tasks.app.rs.school/angular/registration',
      userData
    );
  }
}
