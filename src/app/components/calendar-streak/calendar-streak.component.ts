import {ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-calendar-streak',
  templateUrl: './calendar-streak.component.html',
  styleUrls: ['./calendar-streak.component.scss'],
})
export class CalendarStreakComponent implements OnChanges {
  @Input() streakDays: number[] = [];
  currentYear: number;
  currentMonth: number;
  currentMonthName: string;
  days: { number: number; streak: boolean; isFuture: boolean; isCurrent: boolean }[] = [];
  dayNames: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  constructor(private cdr: ChangeDetectorRef) {
    this.currentYear = new Date().getFullYear();
    this.currentMonth = new Date().getMonth();
    this.currentMonthName = '';
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes['streakDays']) {
      console.log('Días de racha recibidos por el hijo:', changes['streakDays'].currentValue);
      this.updateCalendar();
      this.cdr.detectChanges(); 
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
  
      const day = { number: i, streak: isStreakDay, isFuture, isCurrent };
      this.days.push(day);
  
    }
  }
  
}
