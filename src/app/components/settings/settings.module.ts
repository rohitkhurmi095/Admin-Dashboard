import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { ProfileComponent } from './profile/profile.component';

//Shared module
import { SharedModule } from 'src/app/shared/shared.module';
//reactive forms module
import { ReactiveFormsModule } from '@angular/forms';
//ng Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    NgbModule
  ]
})
export class SettingsModule { }
