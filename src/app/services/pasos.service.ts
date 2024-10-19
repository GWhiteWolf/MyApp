import { Injectable, Injector } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { SqliteService } from './sqlite.service';
import { ToastController } from '@ionic/angular';
import { HistorialActividad } from '../clases/historial-actividad';
import { PedometerData } from '../clases/pedometer-data'


@Injectable({
  providedIn: 'root'
})
export class PasosService {
  public conteoPasos: number = 0;
  public distancia: number = 0;
  public calorias: number = 0;
  public mediaDiaria = { pasos: 0, calorias: 0 };
  private tiempoInicio: number = 0;
  private suscripcionTemporizador: Subscription | null = null;
  private servicioSQLite: SqliteService;

  constructor(private injector: Injector, private toastController: ToastController) {
    this.servicioSQLite = this.injector.get(SqliteService);
  }

  private async mostrarMensajeToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top'
    });
    await toast.present();
  }

  iniciarSeguimiento() {
    this.tiempoInicio = Date.now();

    // iniciar
    if ((window as any).Pedometer) {
      (window as any).Pedometer.startPedometerUpdates((data: PedometerData) => {
        this.conteoPasos = data.numberOfSteps;
        this.calcularMetricas();
        console.log('Pasos actualizados:', this.conteoPasos);
      }, (error: any) => {
        console.error('Error al iniciar el podómetro:', error);
      });
    }    

    this.iniciarTemporizador();
    console.log('Seguimiento iniciado');
  }


  detenerSeguimiento() {
    if (this.suscripcionTemporizador) {
      this.suscripcionTemporizador.unsubscribe();
      this.suscripcionTemporizador = null;

      // Detener
      if ((window as any).Pedometer) {
        (window as any).Pedometer.stopPedometerUpdates(() => {
          console.log('Podómetro detenido');
        }, (error: any) => {
          console.error('Error al detener el podómetro:', error);
        });
      }
      
      console.log('Seguimiento detenido');
    }
  }

  private calcularMetricas() {
    const longitudPaso = 0.78; // Longitud promedio de un paso en metros
    this.distancia = (this.conteoPasos * longitudPaso) / 1000; // Convertir a kilómetros
    const caloriasPorPaso = 0.05;
    this.calorias = this.conteoPasos * caloriasPorPaso;
  }

  private iniciarTemporizador() {
    this.suscripcionTemporizador = interval(600000).subscribe(() => {
      this.guardarProgreso();
    });
  }

  calcularMediaDiaria() {
    this.servicioSQLite.obtenerListaPasos().subscribe(data => {
      if (data.length > 0) {
        const totalPasos = data.reduce((sum, item) => sum + item.conteo_pasos, 0);
        const totalCalorias = data.reduce((sum, item) => sum + (item.conteo_pasos * 0.05), 0);

        this.mediaDiaria.pasos = Math.round(totalPasos / data.length);
        this.mediaDiaria.calorias = Math.round(totalCalorias / data.length);

        console.log('Media Diaria Calculada:', {
          pasosPromedio: this.mediaDiaria.pasos,
          caloriasPromedio: this.mediaDiaria.calorias
        });
      } else {
        console.log('No hay registros para calcular la media diaria.');
      }
    });
  }

  public async guardarProgreso() {
    this.calcularMetricas();
    const fecha = new Date().toISOString();
    const tiempoTranscurrido = this.obtenerTiempoTranscurrido();

    const actividad = new HistorialActividad(
      0,
      fecha,
      this.conteoPasos,
      this.calorias,
      this.distancia,
      tiempoTranscurrido,
      0
    );

    await this.servicioSQLite.agregarRegistroHistorial(actividad);
    const metaAlcanzada = await this.servicioSQLite.verificarMetaDiaria(fecha, this.conteoPasos);

    this.calcularMediaDiaria();
    this.mostrarMensajeToast(`Datos guardados: ${this.conteoPasos} pasos, ${this.distancia.toFixed(2)} km, ${this.calorias.toFixed(2)} kcal, ${tiempoTranscurrido} mins`);

    if (metaAlcanzada) {
      this.mostrarMensajeToast('¡Meta diaria alcanzada!');
    }
    console.log(`Datos guardados: ${this.conteoPasos} pasos, ${this.distancia.toFixed(2)} km, ${this.calorias.toFixed(2)} kcal, ${tiempoTranscurrido} mins`);
  }

  public incrementarPasos() {
    this.conteoPasos += 100;
    this.calcularMetricas();
    if (this.conteoPasos % 100 === 0) {
      this.guardarProgreso();
    }
  }

  public resetearPasos() {
    this.conteoPasos = 0;
    this.distancia = 0;
    this.calorias = 0;
    console.log('Conteo de pasos, distancia y calorías reseteados');
  }

  public async resetearProgreso() {
    await this.servicioSQLite.resetearProgreso();
    this.calcularMediaDiaria();
    this.mostrarMensajeToast('Progreso reseteado en la base de datos');
    console.log('Progreso reseteado en la base de datos');
  }

  public obtenerTiempoTranscurrido(): number {
    return Math.floor((Date.now() - this.tiempoInicio) / 1000 / 60);
  }
}
