import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { InvoiceComponent } from './invoice.component';

//ng2-smartTable
import {Ng2SmartTableModule} from 'ng2-smart-table';
//for API URL
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [InvoiceComponent],
  imports: [
    CommonModule,
    InvoiceRoutingModule,
    SharedModule,
    Ng2SmartTableModule
  ]
})
export class InvoiceModule { }
