import { Component, OnInit } from '@angular/core';
import { PasosService } from '../../services/pasos.service';

@Component({
  selector: 'app-daily-average',
  templateUrl: './daily-average.component.html',
  styleUrls: ['./daily-average.component.scss'],
})
export class DailyAverageComponent  implements OnInit {
  pasosPromedio: number = 0;
  caloriasPromedio: number = 0;

  constructor(private pasosService: PasosService) { }

  ngOnInit() {
    this.pasosService.calcularMediaDiaria();
    this.pasosPromedio = this.pasosService.mediaDiaria.pasos;
    this.caloriasPromedio = this.pasosService.mediaDiaria.calorias;
  }

}
