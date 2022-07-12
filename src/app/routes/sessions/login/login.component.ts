import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

// import { AuthService } from '@services/auth.service';
// import { StorageService } from '@services/storage.service';
import { AuthService, TokenService } from '@core/authentication';
import { filter } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  exportAs: 'ngForm',
})
export class LoginComponent implements OnInit {
  form: any = {
    user_name: null,
    password: null,
    rememberMe: null,
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  role: any = '';
  currentUser: any = {};
  isSubmitting = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {}

  login() {
    this.isSubmitting = true;
    const { user_name, password, rememberMe } = this.form;
    this.auth.login(user_name, password, rememberMe).subscribe(
      data => {
        this.currentUser = {
          ...data,
          username: user_name,
          userRole: 'user',
        };
        this.getProfile();
        this.tokenService.set(this.currentUser);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.role = this.tokenService.getRole();
        this.router.navigateByUrl('/');
      },
      (errorRes: HttpErrorResponse) => {
        if (errorRes.status === 422) {
          const form = this.form;
          const errors = errorRes.error.errors;
          Object.keys(errors).forEach(key => {
            form.get(key === 'email' ? 'username' : key)?.setErrors({
              remote: errors[key][0],
            });
          });
        }
        this.isSubmitting = false;
      }
    );
  }

  getProfile(): void {
    this.auth.userProfile().subscribe({
      next: res => {
        this.currentUser.profile = {
          ...res.data,
          projects: res.data.active_projects,
        };
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      },
    });
  }

  // onSubmit(): void {
  //   const { user_name, password } = this.form;
  //   this.authService.login(user_name, password).subscribe({
  //     next: data => {
  //       this.currentUser = {
  //         ...data,
  //         username: user_name,
  //         userRole: 'user',
  //       };
  //       this.getProfile(data.access_token);
  //       this.storageService.saveUser(this.currentUser);
  //       this.isLoginFailed = false;
  //       this.isLoggedIn = true;
  //       this.roles = this.storageService.getUser().userRole;
  //       this.router.navigateByUrl('/');
  //     },
  //     error: err => {
  //       this.errorMessage = err.error.message;
  //       this.isLoginFailed = true;
  //     },
  //   });
  // }

  // getProfile(access_token: string): void {
  //   this.authService.profile(access_token).subscribe({
  //     next: res => {
  //       this.currentUser.profile = {
  //         ...res.data,
  //         projects: res.data.active_projects,
  //       };
  //     },
  //     error: err => {
  //       this.errorMessage = err.error.message;
  //       this.isLoginFailed = true;
  //     },
  //   });
  // }
}
