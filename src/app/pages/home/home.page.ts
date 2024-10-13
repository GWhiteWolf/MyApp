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
    this.pasosService.incrementarPasos();
    console.log(`Pasos: ${this.pasosService.conteoPasos}`);
    console.log(`Distancia: ${this.pasosService.distancia.toFixed(2)} km`);
    console.log(`Calorías: ${this.pasosService.calorias.toFixed(2)} cal`);
  }

  detenerSeguimiento() {
    this.pasosService.detenerSeguimiento();
  }

  guardarProgreso() {
    this.pasosService['guardarProgreso']();
  }

  pruebaBoton() {
    console.log("Botón de prueba presionado");
    alert("Botón de prueba presionado");
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