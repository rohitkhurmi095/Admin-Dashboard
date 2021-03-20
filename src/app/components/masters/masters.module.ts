import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MastersRoutingModule } from './masters-routing.module';
import { BrandlogoComponent } from './brandlogo/brandlogo.component';
import { CategoryComponent } from './category/category.component';
import { ColorComponent } from './color/color.component';
import { TagComponent } from './tag/tag.component';
import { SizeComponent } from './size/size.component';
import { UsertypeComponent } from './usertype/usertype.component';

//ng-bootstrap
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

//Reactive Forms
import {ReactiveFormsModule} from '@angular/forms';
//Http Methods + API URL from shared Module
import { SharedModule } from 'src/app/shared/shared.module';

//@swimlane/ngx-datatable
import {NgxDatatableModule} from '@swimlane/ngx-datatable'


@NgModule({
  declarations: [BrandlogoComponent, CategoryComponent, ColorComponent, TagComponent, SizeComponent, UsertypeComponent],
  imports: [
    CommonModule,
    MastersRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModule,
    NgxDatatableModule
    
  ]
})
export class MastersModule { }
