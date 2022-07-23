import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, User } from '@core/authentication';

@Component({
  selector: 'app-user-panel',
  template: `
    <div class="matero-user-panel" fxLayout="column" fxLayoutAlign="center center">
      <img
        class="matero-user-panel-avatar"
        [src]="'./assets' + user.profile.avatar_url"
        alt="avatar"
        width="64"
      />
      <h4 class="matero-user-panel-name text-nowrap">
        {{ user.profile.first_name }} {{ user.profile.last_name }}
      </h4>
      <h5 class="user-panel-department text-nowrap">{{ user.profile.department }}</h5>
      <!-- <div class="matero-user-panel-icons">
        <a routerLink="/profile/overview" mat-icon-button>
          <mat-icon class="icon-18">account_circle</mat-icon>
        </a>
        <a routerLink="/profile/settings" mat-icon-button>
          <mat-icon class="icon-18">settings</mat-icon>
        </a>
        <a (click)="logout()" mat-icon-button>
          <mat-icon class="icon-18">exit_to_app</mat-icon>
        </a>
      </div> -->
    </div>
  `,
  styleUrls: ['./user-panel.component.scss'],
})
export class UserPanelComponent implements OnInit {
  user!: User;

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.user().subscribe(user => (this.user = user));
  }

  logout() {
    this.auth.logout().subscribe(() => this.router.navigateByUrl('/auth/login'));
  }
}
