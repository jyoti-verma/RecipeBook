import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponse } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { TEST_USER } from './constants';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = '';
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const { email, password } = form.value;
    let authResponseObservable: Observable<AuthResponse>;

    this.isLoading = true;
    this.error = '';

    if (this.isLoginMode) {
      authResponseObservable = this.authService.login(email, password);
    } else {
      authResponseObservable = this.authService.signUp(email, password);
    }

    authResponseObservable.subscribe(
      () => {
        form.reset();
        this.router.navigate(['/recipes']).then(() => {
          this.isLoading = false;
        });
      },
      (error) => {
        this.error = error;
        this.isLoading = false;
      }
    );
  }

  loginWithTestUser() {
    let authResponseObservable: Observable<AuthResponse>;

    this.isLoading = true;
    this.error = '';
    authResponseObservable = this.authService.login(TEST_USER, TEST_USER);
    authResponseObservable.subscribe(
      () => {
        this.router.navigate(['/recipes']).then(() => {
          this.isLoading = false;
        });
      },
      (error) => {
        this.error = error;
        this.isLoading = false;
      }
    );
  }
}
