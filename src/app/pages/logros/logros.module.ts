import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogrosPageRoutingModule } from './logros-routing.module';

import { LogrosPage } from './logros.page';
import { SharedModule } from 'src/app/components/shared.module';
import { FormularioLogroComponent } from '../../components/formulario-logro/formulario-logro.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogrosPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [LogrosPage, FormularioLogroComponent],
})
export class LogrosPageModule {}
