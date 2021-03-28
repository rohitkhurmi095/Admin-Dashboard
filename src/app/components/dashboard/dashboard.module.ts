import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

//angular-count-to
import { CountToModule } from 'angular-count-to';
//commpon API file
import { SharedModule } from 'src/app/shared/shared.module';
//ng2-smart table
import { Ng2SmartTableModule } from 'ng2-smart-table';
//charts (ng2-charts)
import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    CountToModule,
    SharedModule,
    Ng2SmartTableModule,
    ChartsModule
  ]
})
export class DashboardModule { }
