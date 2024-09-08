import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { SharedModule } from 'src/app/components/shared.module';
import { CircularProgressComponent } from 'src/app/components/circular-progress/circular-progress.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedModule  // importo el modulo compartido
  ],
  declarations: [HomePage, CircularProgressComponent]
})
export class HomePageModule {}
