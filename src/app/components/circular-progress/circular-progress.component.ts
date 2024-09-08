import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-circular-progress',
  templateUrl: './circular-progress.component.html',
  styleUrls: ['./circular-progress.component.scss'],
})
export class CircularProgressComponent  implements OnInit {
  @Input() pasos: number = 0;
  @Input() metaPasos: number = 10000;
  dayName: string = '';

  constructor() { }

  ngOnInit() {
    const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const today = new Date();
    this.dayName = dayNames[today.getDay()];
  }


  get porcentaje(): number {
    return this.pasos / this.metaPasos * 100;
  }
}
