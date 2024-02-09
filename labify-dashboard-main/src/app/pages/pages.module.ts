import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { NbLayoutModule, NbMenuModule, NbSidebarModule, NbThemeModule } from '@nebular/theme';
import { CoreModule } from '../core/core.module';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';

@NgModule({
  declarations: [PagesComponent, HomeComponent, NotFoundComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    NbLayoutModule,
    SharedModule,
    CoreModule,
    NbSidebarModule,
    NbThemeModule,

  ],
})
export class PagesModule {}
