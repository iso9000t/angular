import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NameData, ProfileResponse } from '../models/profile.model';
import { environment } from 'src/environment/environent';
import { Observable } from 'rxjs';
import { RegistrationData } from 'src/app/registration/registration/models/registration.model';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private profileURL: string = `${environment.apiUrl}/profile`;
  constructor(private http: HttpClient) {}

  getProfile(): Observable<ProfileResponse> {
    console.log('service used');
    return this.http.get<ProfileResponse>(this.profileURL);
  }

  updateProfileName(nameData: NameData) {
    return this.http.put(this.profileURL, nameData);
  }
}
