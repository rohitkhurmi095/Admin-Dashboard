import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductListComponent } from './physical/product-list/product-list.component';
import { AddProductComponent } from './physical/add-product/add-product.component';

//Shared Module
import { SharedModule } from 'src/app/shared/shared.module';
//ng-bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//Reactive forms
import { ReactiveFormsModule } from '@angular/forms';
//Datatable
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
//EDITOR
import { CKEditorModule } from 'ngx-ckeditor';


@NgModule({
  declarations: [ProductListComponent, AddProductComponent],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule,
    NgbModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    CKEditorModule

  ]
})
export class ProductsModule { }
