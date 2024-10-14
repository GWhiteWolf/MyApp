import { Component, OnInit } from '@angular/core';
import { SqliteService } from '../../services/sqlite.service';

@Component({
  selector: 'app-weekly-summary',
  templateUrl: './weekly-summary.component.html',
  styleUrls: ['./weekly-summary.component.scss'],
})
export class WeeklySummaryComponent implements OnInit {
  weeklyData: { label: string; percentage: number }[] = [
    { label: 'Lun', percentage: 0 },
    { label: 'Mar', percentage: 0 },
    { label: 'Mie', percentage: 0 },
    { label: 'Jue', percentage: 0 },
    { label: 'Vie', percentage: 0 },
    { label: 'Sab', percentage: 0 },
    { label: 'Dom', percentage: 0 },
  ];

  constructor(private sqliteService: SqliteService) {}

  ngOnInit() {
  }

  
}
