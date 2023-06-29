import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../app.reducer';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated: boolean = false;
  private auth: Auth = inject(Auth);

  constructor(
    private router: Router,
    private uiservice: UIService,
    private store: Store<{ ui: fromApp.State }>
  ) {}

  registerUser(authData: AuthData) {
    this.store.dispatch({ type: 'START_LOADING' });
    createUserWithEmailAndPassword(this.auth, authData.email, authData.password)
      .then(() => {
        this.store.dispatch({ type: 'STOP_LOADING' });
        this.authSuccessfully();
      })
      .catch((error) => {
        this.store.dispatch({ type: 'STOP_LOADING' });
        this.uiservice.showSnackBar(error.message, null, 3000);
      });
  }

  login(authData: AuthData) {
    this.store.dispatch({ type: 'START_LOADING' });
    signInWithEmailAndPassword(this.auth, authData.email, authData.password)
      .then(() => {
        this.store.dispatch({ type: 'STOP_LOADING' });
        this.authSuccessfully();
      })
      .catch((error) => {
        this.store.dispatch({ type: 'STOP_LOADING' });
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
