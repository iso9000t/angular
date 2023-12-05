import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileResponse } from '../models/profile.model';
import { ProfileService } from '../service/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  constructor(private profileService: ProfileService, private router: Router) { }

  ngOnInit(): void {
    this.profileService.getProfile().subscribe((profile: ProfileResponse) => {
      console.log(profile);
    },
      (error) => {
        console.error('Error fetching profile data:', error);
      }
    )
    
  }

}
