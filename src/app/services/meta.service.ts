import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  private streakDaysSource = new BehaviorSubject<number[]>([]); // Días con racha
  streakDays$ = this.streakDaysSource.asObservable();

  constructor() {
    console.log('MetaService inicializado con días de racha:', this.streakDaysSource.value);
  }

  updateStreakDays(newStreakDays: number[]) {
    console.log('Actualizando días de racha:', newStreakDays);
    this.streakDaysSource.next([...newStreakDays]); // Emite una nueva referencia
    console.log('Nuevo valor emitido en streakDaysSource:', this.streakDaysSource.value);
  }
  

  completeMeta(day: number) {
    const currentStreakDays = this.streakDaysSource.value;
    if (!currentStreakDays.includes(day)) {
      const updatedStreakDays = [...currentStreakDays, day].sort((a, b) => a - b); // Añade y ordena los días
      this.streakDaysSource.next(updatedStreakDays); // Emite el nuevo array
      console.log(`Día ${day} añadido a la racha. Nueva lista de días de racha:`, updatedStreakDays);
    } else {
      console.log(`El día ${day} ya está en la lista de racha:`, currentStreakDays);
    }
  }
}
