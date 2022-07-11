import { Component, OnInit } from '@angular/core';

import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  form: any = {
    user_name: null,
    password: null,
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  currentUser: any = {};

  constructor(
    private authService: AuthService,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.currentUser = this.storageService.getUser();
      this.roles = this.currentUser.userRole;
    }
  }

  onSubmit(): void {
    const { user_name, password } = this.form;
    this.authService.login(user_name, password).subscribe({
      next: (data) => {
        this.currentUser = {
          ...data,
          username: user_name,
          userRole: 'user',
        };
        this.getProfile(data.access_token);
        this.storageService.saveUser(this.currentUser);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().userRole;
        // this.reloadPage();
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      },
    });
  }

  reloadPage(): void {
    window.location.reload();
  }

  getProfile(access_token: string): void {
    this.authService.profile(access_token).subscribe({
      next: (res) => {
        this.currentUser.profile = {
          ...res.data,
          projects: res.data.active_projects,
        };
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      },
    });
  }
}
