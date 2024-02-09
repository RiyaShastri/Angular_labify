import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ContactComponent } from './components/contact/contact.component';
import { MapComponent } from './components/map/map.component';
import { AuthComponent } from './components/auth/auth.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { NotFoundPageComponent } from './components/not-found-page/not-found-page.component';
import { RouterModule } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { NgbDropdownModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { ToasterComponent } from './components/toaster/toaster.component';
import { SharedModule } from '../shared/shared.module';
import { ForgetPasswordComponent } from './components/auth/forget-password/forget-password.component';
import { CheckCodeComponent } from './components/auth/check-code/check-code.component';
import { ResetPasswordComponent } from './components/auth/reset-password/reset-password.component';
import { ContactFormComponent } from './components/contact/contact-form/contact-form.component';
import { DriverFormComponent } from './components/contact/driver-form/driver-form.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    ContactComponent,
    MapComponent,
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    NotFoundPageComponent,
    ToasterComponent,
    ForgetPasswordComponent,
    CheckCodeComponent,
    ResetPasswordComponent,
    ContactFormComponent,
    DriverFormComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    GoogleMapsModule,
    NgbDropdownModule,
    NgbToastModule,
    SharedModule
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    ContactComponent,
    MapComponent,
    AuthComponent,
    LoginComponent,
    RegisterComponent,
    NotFoundPageComponent,
    ToasterComponent,
  ],
})
export class CoreModule {}
