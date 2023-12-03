import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegistrationData } from '../registration/models/registration.model';
import { environment } from 'src/environment/environent';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  register(userData: RegistrationData) {
    return this.http.post(
      `${environment.apiUrl}/registration`,
      userData
    );
  }
}
