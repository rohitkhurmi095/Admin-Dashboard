import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AddProductComponent } from './physical/add-product/add-product.component';
import { ProductListComponent } from './physical/product-list/product-list.component';

// /products/physical/componentName
const routes: Routes = [
  {path:'',
    children:[
      {path:'physical/add-product', component:AddProductComponent},
      {path:'physical/product-list', component:ProductListComponent}
    ]
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
