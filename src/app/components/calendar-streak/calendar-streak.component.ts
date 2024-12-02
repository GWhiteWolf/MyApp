import { Component, OnInit, OnDestroy } from '@angular/core';
import { MetaService } from '../../services/meta.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-calendar-streak',
  templateUrl: './calendar-streak.component.html',
  styleUrls: ['./calendar-streak.component.scss'],
})
export class CalendarStreakComponent implements OnInit, OnDestroy {
  currentYear: number;
  currentMonth: number;
  currentMonthName: string;
  days: { number: number; streak: boolean; isFuture: boolean; isCurrent: boolean }[] = [];
  dayNames: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  streakDays: number[] = []; // Días con racha

  private streakDaysSubscription: Subscription | null = null;

  constructor(private metaService: MetaService) {
    this.currentYear = new Date().getFullYear();
    this.currentMonth = new Date().getMonth();
    this.currentMonthName = '';
  }

  ngOnInit() {
    this.subscribeToStreakDays();
    this.updateCalendar();
  }

  ionViewWillEnter() {
    // Actualiza el calendario al entrar a la vista
    this.updateCalendar();
  }

  private subscribeToStreakDays() {
    if (!this.streakDaysSubscription) {
      this.streakDaysSubscription = this.metaService.streakDays$.subscribe((updatedStreakDays) => {
        console.log('Días de racha actualizados en el componente:', updatedStreakDays);
        this.streakDays = updatedStreakDays;
        this.updateCalendar();
      });
    }
  }

  private unsubscribeFromStreakDays() {
    if (this.streakDaysSubscription) {
      this.streakDaysSubscription.unsubscribe();
      this.streakDaysSubscription = null;
    }
  }

  updateCalendar() {
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);
    const today = new Date();
    const daysInMonth = lastDayOfMonth.getDate();

    this.currentMonthName = firstDayOfMonth.toLocaleString('default', { month: 'long' });

    this.days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const isStreakDay = this.streakDays.includes(i);

      const isFuture =
        this.currentYear > today.getFullYear() ||
        (this.currentYear === today.getFullYear() && this.currentMonth > today.getMonth()) ||
        (this.currentYear === today.getFullYear() && this.currentMonth === today.getMonth() && i > today.getDate());

      const isCurrent =
        i === today.getDate() &&
        this.currentMonth === today.getMonth() &&
        this.currentYear === today.getFullYear();

      this.days.push({ number: i, streak: isStreakDay, isFuture, isCurrent });
    }

    console.log('Días generados para el calendario:', this.days);
  }

  ngOnDestroy() {
    this.unsubscribeFromStreakDays();
  }
}
