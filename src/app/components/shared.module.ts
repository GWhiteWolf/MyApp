import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular'; 
import { Componente1Component } from './componente1/componente1.component';
import { Componente2Component } from './componente2/componente2.component';
import { CalendarStreakComponent } from './calendar-streak/calendar-streak.component';
import { CircularProgressComponent } from './circular-progress/circular-progress.component';

@NgModule({
  declarations: [Componente1Component, Componente2Component, CalendarStreakComponent, CircularProgressComponent],
  imports: [CommonModule, IonicModule],
  exports: [Componente1Component, Componente2Component, CalendarStreakComponent, CircularProgressComponent],
})
export class SharedModule {}
