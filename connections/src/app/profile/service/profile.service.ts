import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProfileResponse } from '../models/profile.model';
import { environment } from 'src/environment/environent';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private profileURL:string = `${environment.apiUrl}/profile`;
  constructor(private http: HttpClient) { }

  getProfile(): Observable<ProfileResponse> {
    
   const headers = new HttpHeaders({
     'rs-uid': localStorage.getItem('uid') || '',
     'rs-email': localStorage.getItem('email') || '',
     Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
   });
    
    return this.http.get<ProfileResponse>(this.profileURL, {headers});
  }
}
