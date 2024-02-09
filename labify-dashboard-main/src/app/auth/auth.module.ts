import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AuthRoutingModule } from "./auth-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { NbAuthModule } from "@nebular/auth";
import {
  NbAlertModule,
  NbInputModule,
  NbButtonModule,
  NbCheckboxModule,
  NbFormFieldModule,
  NbIconModule,
  NbSpinnerModule,
} from "@nebular/theme";
import { LoginComponent } from "./login/login.component";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    NbInputModule,
    NbButtonModule,
    NbFormFieldModule,
    NbAuthModule,
    NbIconModule,
    NbSpinnerModule,
    HttpClientModule
  ],
})

export class AuthModule {}
