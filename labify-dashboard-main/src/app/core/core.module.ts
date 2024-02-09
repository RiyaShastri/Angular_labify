import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavMenuComponent } from './components/sidenav-menu/sidenav-menu.component';
import { NbMenuModule, NbUserModule } from '@nebular/theme';
import { HeaderComponent } from './components/header/header.component';
import { SharedModule } from '../shared/shared.module';
import { NotFoundComponent } from './components/not-found/not-found.component';

@NgModule({
  declarations: [SidenavMenuComponent, HeaderComponent, NotFoundComponent],
  imports: [CommonModule, NbMenuModule, SharedModule, NbUserModule],
  exports: [SidenavMenuComponent, HeaderComponent, NotFoundComponent],
})
export class CoreModule {}
