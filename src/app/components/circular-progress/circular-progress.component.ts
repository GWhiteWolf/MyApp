import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { PasosService } from '../../services/pasos.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-circular-progress',
  templateUrl: './circular-progress.component.html',
  styleUrls: ['./circular-progress.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CircularProgressComponent implements OnInit, OnDestroy {
  pasos: number = 0;
  metaPasos: number = 10000;
  dayName: string = '';
  private subscription: Subscription | null = null;


  constructor(private cd: ChangeDetectorRef, private pasosService: PasosService, ) {}

  ngOnInit() {
    const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const today = new Date();
    this.dayName = dayNames[today.getDay()];

    this.subscription = this.pasosService.conteoPasos$.subscribe(pasos => {
      this.pasos = pasos;
      this.cd.markForCheck();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  get porcentaje(): number {
    return (this.pasos / this.metaPasos) * 100;
  }
}
