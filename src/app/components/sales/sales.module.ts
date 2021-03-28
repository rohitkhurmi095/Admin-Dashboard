import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SalesRoutingModule } from './sales-routing.module';
import { OrdersComponent } from './orders/orders.component';
import { TransactionsComponent } from './transactions/transactions.component';
//ng2-smart-table
import { Ng2SmartTableModule } from 'ng2-smart-table';
//for API URL
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [OrdersComponent, TransactionsComponent],
  imports: [
    CommonModule,
    SalesRoutingModule,
    SharedModule,
    Ng2SmartTableModule
  ]
})
export class SalesModule { }
