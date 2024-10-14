import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-calendar-streak',
  templateUrl: './calendar-streak.component.html',
  styleUrls: ['./calendar-streak.component.scss'],
})
export class CalendarStreakComponent implements OnInit {
  currentYear: number;
  currentMonth: number;
  currentMonthName: string;
  days: { number: number, streak: boolean, isFuture: boolean, isCurrent: boolean }[] = [];
  dayNames: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  streakDays = [1, 2, 3, 5, 8, 9, 10]; 
  
  constructor(private cdr: ChangeDetectorRef) {
    this.currentYear = new Date().getFullYear();
    this.currentMonth = new Date().getMonth();
    this.currentMonthName = '';
  }

  ngOnInit() {
    this.updateCalendar();
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
      
      // Comparar si el día es futuro
      const isFuture = (this.currentYear > today.getFullYear()) || 
                      (this.currentYear === today.getFullYear() && this.currentMonth > today.getMonth()) ||
                      (this.currentYear === today.getFullYear() && this.currentMonth === today.getMonth() && i > today.getDate());

      // Comparar si es el día actual
      const isCurrent = (i === today.getDate() && 
                        this.currentMonth === today.getMonth() &&
                        this.currentYear === today.getFullYear());

      this.days.push({ number: i, streak: isStreakDay, isFuture, isCurrent });
    }

    // Forzar la actualización de la vista
    this.cdr.detectChanges();
  }
}
