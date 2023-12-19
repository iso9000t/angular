import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NameData, ProfileResponse } from '../models/profile.model';
import { environment } from 'src/environment/environent';
import { catchError, Observable, throwError } from 'rxjs';
import { RegistrationData } from 'src/app/registration/registration/models/registration.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private profileURL: string = `${environment.apiUrl}/profile`;
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  getProfile(): Observable<ProfileResponse> {
    console.log('service used');
    return this.http.get<ProfileResponse>(this.profileURL).pipe(
      catchError((error) => {
        console.log(error.error);
        this.snackBar.open(error.message, 'Close', {
          duration: 6000,
        });
        return throwError(error);
      })
    );
  }

  updateProfileName(nameData: NameData): Observable<any> {
    return this.http.put(this.profileURL, nameData).pipe(
      catchError((error) => {
        return throwError(error.error);
      })
    );
  }
}
