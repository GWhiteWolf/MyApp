import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PageComponentPageRoutingModule } from './page-component-routing.module';

import { PageComponentPage } from './page-component.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PageComponentPageRoutingModule
  ],
  declarations: [PageComponentPage]
})
export class PageComponentPageModule {}
