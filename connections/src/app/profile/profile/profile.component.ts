import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileResponse } from '../models/profile.model';
import { ProfileService } from '../service/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  createdAt: string = '';
  email: string = '';
  name: string = '';
  uid: string = '';

  constructor(private profileService: ProfileService, private router: Router) {}

  ngOnInit(): void {
    this.profileService.getProfile().subscribe(
      (profile: ProfileResponse) => {
        this.createdAt = profile.createdAt.S;
        this.email = profile.email.S;
        this.name = profile.name.S;
        this.uid = profile.uid.S;
      },
      (error) => {
        console.error('Error fetching profile data:', error);
      }
    );
  }
}
