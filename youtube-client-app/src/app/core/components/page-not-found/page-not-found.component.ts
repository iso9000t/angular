import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent {
  constructor(private router: Router) {}
  goToMain() {
    this.router.navigate(['/main']);
  }
}
