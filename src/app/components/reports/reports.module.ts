import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';

//ng2-smart-table
import { Ng2SmartTableModule } from 'ng2-smart-table';

//CHARTS
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { ChartistModule } from 'ng-chartist';
import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [ReportsComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ChartsModule,
    Ng2SmartTableModule,
    Ng2GoogleChartsModule,
    ChartistModule,
    ChartsModule

  ]
})
export class ReportsModule { }
