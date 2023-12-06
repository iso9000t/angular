import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadProfile } from 'src/app/redux/actions/profile-fetch.action';
import { selectProfile, selectProfileError } from 'src/app/redux/selectors/profile.selector';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profile$ = this.store.select(selectProfile);
  error$ = this.store.select(selectProfileError);
  
  constructor(
    private router: Router,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.store.dispatch(loadProfile());
  }
}
