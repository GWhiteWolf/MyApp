import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MetaService {
  private streakDaysSource = new BehaviorSubject<number[]>([]); // Días con racha
  streakDays$ = this.streakDaysSource.asObservable();

  constructor() {
    this.streakDaysSource = new BehaviorSubject<number[]>([]);
  }

  // Actualizar
  updateStreakDays(newStreakDays: number[]) {
    this.streakDaysSource.next(newStreakDays);
  }

  // Completar una meta y actualizar la racha
  completeMeta(day: number) {
    const currentStreakDays = this.streakDaysSource.value;
    if (!currentStreakDays.includes(day)) {
      const updatedStreakDays = [...currentStreakDays, day];
      this.streakDaysSource.next(updatedStreakDays);
      console.log(`Día ${day} añadido a la racha. Nueva lista:`, updatedStreakDays);
    } else {
      console.log(`El día ${day} ya está en la racha.`);
    }
  }
}
