import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { MapSvgComponent } from './components/map-section/map-svg/map-svg.component';
import { MapSectionComponent } from './components/map-section/map-section.component';
import { RouterModule } from '@angular/router';
import { AddEditAddressComponent } from './components/add-edit-address/add-edit-address.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoadingSpinnerDirective } from './directives/loading-spinner.directive';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@NgModule({
  declarations: [
    ProductCardComponent,
    MapSvgComponent,
    MapSectionComponent,
    AddEditAddressComponent,
    LoadingSpinnerDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbPaginationModule,
    SweetAlert2Module,
    NgxSkeletonLoaderModule,
  ],
  exports: [
    ProductCardComponent,
    MapSectionComponent,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    LoadingSpinnerDirective,
    NgbPaginationModule,
    SweetAlert2Module,
    NgxSkeletonLoaderModule,
  ],
})
export class SharedModule {}
