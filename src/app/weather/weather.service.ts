import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiKey = '59fbedff4b8235728c58ef6c90088acd';  // Tu API key de OpenWeather
  private apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
  private callbackID: string | null = null;

  constructor(private http: HttpClient) {
    // Se inicia el rastreo de forma automática
    this.startTrackingWeather((weatherData) => {
    })
  }

  getWeatherByCoordinates(lat: number, lon: number): Observable<any> {
    const url = `${this.apiUrl}?lat=${lat}&lon=${lon}&units=metric&appid=${this.apiKey}`;
    return this.http.get(url);
  }

  // Verificar y solicitar permisos de geolocalización
  private async checkPermissions() {
    const permStatus = await Geolocation.checkPermissions();
    if (permStatus.location !== 'granted') {
      await Geolocation.requestPermissions();
    }
  }

  public async startTrackingWeather(callback: (weatherData: any) => void){
    await this.checkPermissions();

    this.callbackID = await Geolocation.watchPosition(
      {enableHighAccuracy: true},
      async (position, err) => {
        if (err) {
          console.error('Error al obtener la posición', err);
          return;
        }
        if (position && position.coords){
          const { latitude, longitude } = position.coords;
          this.getWeatherByCoordinates(latitude, longitude).subscribe(
            weatherData => callback(weatherData),
            error => console.error('Error al obtener el clima:', error)
          );
        } else {
          console.error('Posición es null');
        }
      }
    );
  }

  public stopTrackingWeather(){
    if (this.callbackID) {
      Geolocation.clearWatch({id: this.callbackID});
      this.callbackID = null;
    }
  }
}
