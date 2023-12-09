import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environent';
import { GroupUpdateResponse } from '../models/group.model';

@Injectable({
  providedIn: 'root', // This ensures the service is available application-wide
})
  
export class GroupService {
  private groupListURL: string = `${environment.apiUrl}/groups/list`;

  constructor(private http: HttpClient) {}

  updateGroupList(): Observable<GroupUpdateResponse> {
    console.log('Updating group list');
    return this.http.get<GroupUpdateResponse>(this.groupListURL);
  }
}
