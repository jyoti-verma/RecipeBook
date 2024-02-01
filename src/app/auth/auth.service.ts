import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import {
  AuthError,
  AuthEndpoint,
  AUTH_API_KEY,
  USER_DATA_STORAGE_KEY,
  TEST_USER,
} from './constants';
import { User } from './user.module';
import { Router } from '@angular/router';
import { RecipeService } from '../recipes/recipe.service';

export interface AuthResponse {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

interface UserData {
  email: string;
  id: string;
  _token: string;
  _tokenExpirationDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User>(null);
  isTestUser: boolean = false;
  tokenExpirationTimer: NodeJS.Timeout;

  constructor(private http: HttpClient, private router: Router, private recipeService: RecipeService) {}

  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${AuthEndpoint.SIGN_UP}?key=${AUTH_API_KEY}`, {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.handleAuthErrorResponse),
        tap((responseData) => {
          const { email, localId, idToken, expiresIn } = responseData;
          this.handleAuthResponse(email, localId, idToken, +expiresIn);
        })
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${AuthEndpoint.SIGN_IN}?key=${AUTH_API_KEY}`, {
        email,
        password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.handleAuthErrorResponse),
        tap((responseData) => {
          const { email, localId, idToken, expiresIn } = responseData;
          this.handleAuthResponse(email, localId, idToken, +expiresIn);
        })
      );
  }

  autoLogin() {
    const userData: UserData = JSON.parse(
      localStorage.getItem(USER_DATA_STORAGE_KEY)
    );
    if (!userData) {
      return;
    }
    const { email, id, _token, _tokenExpirationDate } = userData;
    const loadedUser = new User(
      email,
      id,
      _token,
      new Date(_tokenExpirationDate)
    );
    if (loadedUser.token) {
      this.isTestUser = email === TEST_USER;
      this.user.next(loadedUser);
      this.autoLogout(
        new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
      );
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem(USER_DATA_STORAGE_KEY);
    this.isTestUser = false;
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.recipeService.removeRecipes();
  }

  autoLogout(expirationDuration: number) {
    console.info(
      `User will be logged out after ${expirationDuration / 1000} seconds`
    );
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
      this.recipeService.removeRecipes();
    }, expirationDuration);
  }

  private handleAuthResponse(
    email: string,
    id: string,
    token: string,
    expiresIn: number
  ) {
    const user = new User(
      email,
      id,
      token,
      new Date(new Date().getTime() + +expiresIn * 1000)
    );

    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem(USER_DATA_STORAGE_KEY, JSON.stringify(user));
    this.isTestUser = email === TEST_USER;
  }

  private handleAuthErrorResponse(errorResponse: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred.';
    const errorCode = errorResponse?.error?.error?.message;

    if (!errorCode) {
      return throwError(errorMessage);
    }

    if (AuthError.hasOwnProperty(errorCode)) {
      return throwError(AuthError[errorCode]);
    } else {
      return throwError(errorMessage);
    }
  }
}
