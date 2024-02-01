import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { mySignature } from 'src/utils/commonUtils';
import { TEST_USER } from './auth/constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'av-recipe-book';
  isTestUser = this.authService.isTestUser;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.autoLogin();
    this.authService.user.subscribe((user) => {
      if (user) {
        this.isTestUser = user.email === TEST_USER;
      } else {
        this.isTestUser = false;
      }
    });
    mySignature();
  }
}
