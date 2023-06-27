import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated: boolean = false;
  private auth: Auth = inject(Auth);

  constructor(private router: Router) {}

  registerUser(authData: AuthData) {
    createUserWithEmailAndPassword(this.auth, authData.email, authData.password)
      .then(() => {
        this.authSuccessfully();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  login(authData: AuthData) {
    signInWithEmailAndPassword(this.auth, authData.email, authData.password)
      .then(() => {
        this.authSuccessfully();
      })
      .catch((error) => {
        console.log(error);
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
