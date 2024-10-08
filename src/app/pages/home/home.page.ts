import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  weatherData: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getWeatherData();
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
}
