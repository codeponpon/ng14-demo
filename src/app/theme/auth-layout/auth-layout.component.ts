import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, TokenService } from '@core';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AuthLayoutComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    const currentUser = this.tokenService.currentUser();
    if (currentUser && currentUser.profile) {
      this.auth.setUser();
      this.router.navigateByUrl('/');
    }
  }
}
