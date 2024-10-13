import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PasosService } from '../../services/pasos.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  weatherData: any;
  seguimientoActivo: boolean = true; // Nueva variable para el estado de seguimiento

  constructor(
    private http: HttpClient,
    public pasosService: PasosService
  ) {}

  ngOnInit() {
    this.getWeatherData();
    this.pasosService.iniciarSeguimiento();
  }

  getWeatherData() {
    const apiKey = '59fbedff4b8235728c58ef6c90088acd';
    const city = 'Viña del Mar';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    this.http.get(url).subscribe(data => {
      this.weatherData = data;
    }, error => {
      console.log('Error obteniendo los datos del clima', error);
    });
  }

  incrementarPasos() {
    if (this.seguimientoActivo) { 
      this.pasosService.incrementarPasos();
      console.log(`Pasos: ${this.pasosService.conteoPasos}`);
      console.log(`Distancia: ${this.pasosService.distancia.toFixed(2)} km`);
      console.log(`Calorías: ${this.pasosService.calorias.toFixed(2)} cal`);
    } else {
      console.log("El seguimiento está en pausa, no se pueden incrementar los pasos.");
    }
  }

  detenerSeguimiento() {
    if (this.seguimientoActivo) {
      this.pasosService.detenerSeguimiento();
      console.log('Seguimiento detenido');
    } else {
      this.pasosService.iniciarSeguimiento();
      console.log('Seguimiento reanudado');
    }
    this.seguimientoActivo = !this.seguimientoActivo; // Cambia el estado
  }

  guardarProgreso() {
    this.pasosService.guardarProgreso();
  }

  resetearPasos() {
    this.pasosService.resetearPasos();
    console.log('Pasos reseteados');
  }

  resetearProgreso() {
    this.pasosService.resetearProgreso();
    console.log('Progreso reseteado en la base de datos');
  }
}
