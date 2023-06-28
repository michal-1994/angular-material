import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { UIService } from '../shared/ui.service';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated: boolean = false;
  private auth: Auth = inject(Auth);

  constructor(private router: Router, private uiservice: UIService) {}

  registerUser(authData: AuthData) {
    this.uiservice.loadingStateChanged.next(true);
    createUserWithEmailAndPassword(this.auth, authData.email, authData.password)
      .then(() => {
        this.uiservice.loadingStateChanged.next(false);
        this.authSuccessfully();
      })
      .catch((error) => {
        this.uiservice.loadingStateChanged.next(false);
        this.uiservice.showSnackBar(error.message, null, 3000);
      });
  }

  login(authData: AuthData) {
    this.uiservice.loadingStateChanged.next(true);
    signInWithEmailAndPassword(this.auth, authData.email, authData.password)
      .then(() => {
        this.uiservice.loadingStateChanged.next(false);
        this.authSuccessfully();
      })
      .catch((error) => {
        this.uiservice.loadingStateChanged.next(false);
        this.uiservice.showSnackBar(error.message, null, 3000);
      });
  }

  logout() {
    this.authChange.next(false);
    this.router.navigate(['/login']);
    this.isAuthenticated = false;
  }

  isAuth() {
    return this.isAuthenticated;
  }

  private authSuccessfully() {
    this.isAuthenticated = true;
    this.authChange.next(true);
    this.router.navigate(['/training']);
  }
}
