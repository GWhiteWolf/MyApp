import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PasosService } from '../../services/pasos.service';
import { LocalNotifications } from '@capacitor/local-notifications';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { Pedometer } from '@ionic-native/pedometer/ngx';
import { Geolocation } from '@capacitor/geolocation';
import { WeatherService } from 'src/app/weather/weather.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  pasos: number = 0;
  weatherData: any;
  seguimientoActivo: boolean = true;

  constructor(
    private http: HttpClient,
    public pasosService: PasosService,
    private androidPermissions: AndroidPermissions,
    private pedometer: Pedometer,
    private weatherService: WeatherService
  ) {}

  ngOnInit() {
    this.getWeatherData();
    this.pasosService.iniciarSeguimiento();
    this.requestPedometerPermission();
    this.pasosService.conteoPasos$.subscribe(pasos => {
      this.pasos = pasos;
    });
  }

  async ionViewDidEnter() {
    await this.requestNotificationPermission();
  }


  async getWeatherData(){
    try {
      // Obtener la posición actual
      const position = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });

      // Obtener las coordenadas
      const { latitude, longitude } = position.coords;

      // Llamar a la API del clima usando las coordenadas
      this.weatherService.getWeatherByCoordinates(latitude, longitude).subscribe(
        data => {
          this.weatherData = data;
          console.log('Datos del clima:', this.weatherData);
        },
        error => {
          console.log('Error obteniendo los datos del clima', error);
        }
      );

    } catch (error) {
      console.log('Error obteniendo la posición', error);
    }
  }
  // getWeatherData() {
  //   const apiKey = '59fbedff4b8235728c58ef6c90088acd';
  //   const city = 'Viña del Mar';
  //   const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  //   this.http.get(url).subscribe(data => {
  //     this.weatherData = data;
  //   }, error => {
  //     console.log('Error obteniendo los datos del clima', error);
  //   });
  // }



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
      // Si el seguimiento está activo, lo detenemos
      this.pasosService.detenerSeguimiento();
      console.log('Seguimiento detenido');
    } else {
      // Si el seguimiento está inactivo, lo reanudamos sin reiniciar el contador
      this.pasosService.reanudarSeguimiento();
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

  async requestNotificationPermission() {
    const result = await LocalNotifications.requestPermissions();
    if (result.display === 'granted') {
      console.log('Permisos concedidos para enviar notificaciones');
    } else {
      console.log('Permisos denegados para enviar notificaciones');
    }
  }

  async requestPedometerPermission() {
    try {
      const permission = await this.androidPermissions.checkPermission(
        this.androidPermissions.PERMISSION.ACTIVITY_RECOGNITION
      );
  
      if (permission.hasPermission) {
        console.log('Permiso ya concedido.');
        return;
      }
  
      console.log('Permiso no concedido. Intentando solicitarlo...');
      await this.androidPermissions.requestPermission(
        this.androidPermissions.PERMISSION.ACTIVITY_RECOGNITION
      ).then(
        result => {
          if (result.hasPermission) {
            console.log('Permiso concedido.');
          } else {
            console.log('Permiso denegado por el usuario.');
            alert('Para usar el contador de pasos, habilita el permiso en Configuración > Aplicaciones > Permisos.');
          }
        },
        err => {
          console.error('Error al solicitar permiso:', err);
          alert('Para usar el contador de pasos, habilita el permiso en Configuración > Aplicaciones > Permisos.');
        }
      );
    } catch (error) {
      console.error('Error verificando permisos:', error);
      alert('Para usar el contador de pasos, habilita el permiso en Configuración > Aplicaciones > Permisos.');
    }
  }
  
  
}
