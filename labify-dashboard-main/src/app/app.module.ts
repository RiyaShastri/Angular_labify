import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  NbThemeModule,
  NbSidebarModule,
  NbMenuModule,
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbToastrModule,
  NbWindowModule,
  NbIconModule,
  NbTimepickerModule,
} from '@nebular/theme';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthInterceptorProvider } from './core/interceptors/auth.interceptor';
import { HttpClientModule } from '@angular/common/http';
import { NbAuthModule } from '@nebular/auth';
import { NbEvaIconsModule } from '@nebular/eva-icons';

import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideMessaging,getMessaging } from '@angular/fire/messaging';

const TOKEN = JSON.parse(localStorage.getItem('auth_app_token')!!)?.value;
const SOCKET_CONFIG: SocketIoConfig = {
  url: environment.socketUrl,
  options: {
    extraHeaders: {
      Authorization: TOKEN,
    },
  },
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    NbAuthModule.forRoot(),
    NbTimepickerModule.forRoot(),
    NbEvaIconsModule,
    NbIconModule,
    // GooglePlaceModule,
    SocketIoModule.forRoot(SOCKET_CONFIG),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideMessaging(() => getMessaging()),
  ],
  providers: [AuthInterceptorProvider, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
