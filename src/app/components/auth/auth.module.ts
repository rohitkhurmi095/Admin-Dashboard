import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';

//ng-bootstrap
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

//Reactive Forms
import {ReactiveFormsModule} from '@angular/forms';
//Http Methods + API URL from shared Module
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModule,
  ]
})
export class AuthModule { }
