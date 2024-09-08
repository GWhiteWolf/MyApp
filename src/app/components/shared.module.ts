import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular'; 
import { Componente1Component } from './componente1/componente1.component';
import { Componente2Component } from './componente2/componente2.component';

@NgModule({
  declarations: [Componente1Component, Componente2Component],
  imports: [CommonModule, IonicModule],
  exports: [Componente1Component, Componente2Component]
})
export class SharedModule {}
