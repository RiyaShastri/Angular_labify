import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockPageComponent } from './stock-page.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { StockPageRoutingModule } from './stock-page-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    StockPageComponent
  ],
  imports: [
    CommonModule,
    StockPageRoutingModule,
    FormsModule,
    NgxDatatableModule.forRoot({
      messages: {
        emptyMessage: 'No data to display',
        totalMessage: 'total',
        selectedMessage: 'selected'
      }
    })
  ]
})
export class StockPageModule { }
