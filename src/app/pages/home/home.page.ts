import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PasosService } from '../../services/pasos.service';
import { LocalNotifications } from '@capacitor/local-notifications';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { Pedometer } from '@ionic-native/pedometer/ngx';

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
    private pedometer: Pedometer
  ) {}

  ngOnInit() {
    this.getWeatherData();
    this.pasosService.iniciarSeguimiento();
    this.pasosService.conteoPasos$.subscribe(pasos => {
      this.pasos = pasos;
    });
  }

  async ionViewDidEnter() {
    await this.requestNotificationPermission();
    this.requestPedometerPermission();
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
    const permission = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACTIVITY_RECOGNITION);
    if (!permission.hasPermission) {
      this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACTIVITY_RECOGNITION).then(
        result => console.log('Permiso concedido:', result),
        err => console.error('Permiso denegado:', err)
      );
    } else {
      console.log('Permiso de reconocimiento de actividad ya concedido.');
    }
  }
}
