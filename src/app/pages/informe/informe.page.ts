import { Component, OnInit } from '@angular/core';
import { MetaService } from '../../services/meta.service';

@Component({
  selector: 'app-informe',
  templateUrl: './informe.page.html',
  styleUrls: ['./informe.page.scss'],
})
export class InformePage implements OnInit {
  streakDays: number[] = [];

  constructor(private metaService: MetaService) {}

  ngOnInit() {
    // Suscripción inicial para obtener datos de racha
    this.metaService.streakDays$.subscribe((days) => {
      console.log('Días de racha inicial en Informe:', days);
      this.streakDays = [...days]; // Nueva referencia para Angular
    });
  }

  ionViewWillEnter() {
    this.metaService.streakDays$.subscribe((days) => {
      console.log('Días de racha en Informe antes de pasar al hijo:', days); // Verifica aquí
      this.streakDays = [...days]; // Crea una nueva referencia
    });
  }
}
