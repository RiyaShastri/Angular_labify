import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from './core/core.module';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AuthInterceptorProvider } from './core/interceptors/auth.interceptor';
import { CareerPageComponent } from './pages/career-page/career-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { PrivacyComponent } from './pages/privacy/privacy.component';

@NgModule({
  declarations: [AppComponent, CareerPageComponent, PrivacyComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    CoreModule,
    SweetAlert2Module.forRoot(),
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [AuthInterceptorProvider],
  bootstrap: [AppComponent],
})
export class AppModule {}
