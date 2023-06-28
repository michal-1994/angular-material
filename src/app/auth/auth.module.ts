import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { getAuth, provideAuth } from '@angular/fire/auth';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  declarations: [SignupComponent, LoginComponent],
  imports: [ReactiveFormsModule, SharedModule, provideAuth(() => getAuth())],
  exports: [],
})
export class AuthModule {}
