import { Component, OnInit} from '@angular/core';
import { PasosService } from '../../services/pasos.service';
import { SqliteService } from '../../services/sqlite.service';

@Component({
  selector: 'app-daily-average',
  templateUrl: './daily-average.component.html',
  styleUrls: ['./daily-average.component.scss'],
})
export class DailyAverageComponent implements OnInit {
  pasosPromedio: number = 0;
  caloriasPromedio: number = 0;

  constructor(
    private pasosService: PasosService,
    private sqliteService: SqliteService
  ) {}

  ngOnInit() {
    this.pasosService.mediaDiaria$.subscribe((mediaDiaria) => {
      this.pasosPromedio = mediaDiaria.pasos;
      this.caloriasPromedio = mediaDiaria.calorias;
      console.log('Media diaria actualizada en el componente:', mediaDiaria);
    });
  }
}

