import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated: boolean = false;
  private auth: Auth = inject(Auth);

  constructor(
    private router: Router,
    private uiservice: UIService,
    private store: Store<fromRoot.State>
  ) {}

  registerUser(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    createUserWithEmailAndPassword(this.auth, authData.email, authData.password)
      .then(() => {
        this.store.dispatch(new UI.StopLoading());
        this.authSuccessfully();
      })
      .catch((error) => {
        this.store.dispatch(new UI.StopLoading());
        this.uiservice.showSnackBar(error.message, null, 3000);
      });
  }

  login(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    signInWithEmailAndPassword(this.auth, authData.email, authData.password)
      .then(() => {
        this.store.dispatch(new UI.StopLoading());
        this.authSuccessfully();
      })
      .catch((error) => {
        this.store.dispatch(new UI.StopLoading());
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
