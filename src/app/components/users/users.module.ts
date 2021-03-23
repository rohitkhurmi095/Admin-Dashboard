import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { ListUserComponent } from './list-user/list-user.component';
import { CreateUserComponent } from './create-user/create-user.component';

//for commpon shared files
import { SharedModule } from 'src/app/shared/shared.module';
//ng Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//Reactive Forms
import { ReactiveFormsModule } from '@angular/forms';

//@swimlane/ngx-datatable
import {NgxDatatableModule} from '@swimlane/ngx-datatable'


@NgModule({
  declarations: [ListUserComponent, CreateUserComponent],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    NgbModule,
    ReactiveFormsModule,
    NgxDatatableModule
  ]
})
export class UsersModule { }
