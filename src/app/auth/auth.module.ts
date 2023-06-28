import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

@NgModule({
  declarations: [SignupComponent, LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    provideAuth(() => getAuth()),
  ],
  exports: [],
})
export class AuthModule {}
