import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from "ng2-select";
import { DataTablesModule } from "angular-datatables";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { ListSalesComponent } from './list-sales/list-sales.component';
import { SalesFormComponent } from './sales-form/sales-form.component';

@NgModule({
  declarations:
   [ListSalesComponent, 
    SalesFormComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SweetAlert2Module,
    SelectModule,
    DataTablesModule,
    BrowserAnimationsModule,
    ToastrModule,
  ]
})
export class SalesModule { }
