import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InformePageRoutingModule } from './informe-routing.module';

import { InformePage } from './informe.page';
import { SharedModule } from 'src/app/components/shared.module';
import { DailyAverageComponent } from 'src/app/components/daily-average/daily-average.component';
import { WeeklySummaryComponent } from 'src/app/components/weekly-summary/weekly-summary.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InformePageRoutingModule,
    SharedModule
  ],
  declarations: [
    InformePage,
    DailyAverageComponent,
    WeeklySummaryComponent]
})
export class InformePageModule {}
