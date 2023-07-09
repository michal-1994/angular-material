import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Store } from '@ngrx/store';

import { AuthData } from './auth-data.model';
import { UIService } from '../shared/ui.service';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as AuthActions from '../auth/auth.actions';

@Injectable()
export class AuthService {
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
    this.store.dispatch(new AuthActions.SetUnauthenticated());
    this.router.navigate(['/login']);
  }

  private authSuccessfully() {
    this.store.dispatch(new AuthActions.SetAuthenticated());
    this.router.navigate(['/training']);
  }
}
