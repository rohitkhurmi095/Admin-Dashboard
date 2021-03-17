import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrdersComponent } from './orders/orders.component';
import { TransactionsComponent } from './transactions/transactions.component';

// /sales/orders & /sales/transactions
const routes: Routes = [
  {path:'',
    children:[
      {path:'orders', component:OrdersComponent},
      {path:'transactions', component:TransactionsComponent}
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SalesRoutingModule { }
