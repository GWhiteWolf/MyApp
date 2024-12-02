import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject,Subscription, interval } from 'rxjs';
import { SqliteService } from './sqlite.service';
import { ToastController } from '@ionic/angular';
import { HistorialActividad } from '../clases/historial-actividad';
import { LogroService } from './logro.service';
import { Pedometer } from '@ionic-native/pedometer/ngx';
import { MetaService } from './meta.service'; 

@Injectable({
  providedIn: 'root'
})
export class PasosService {
  private conteoPasosSource = new BehaviorSubject<number>(0);
  public conteoPasos$ = this.conteoPasosSource.asObservable();
  public conteoPasos: number = 0;
  public distancia: number = 0;
  public calorias: number = 0;

  private metaDiaria: number = 10000;

  private mediaDiariaSource = new BehaviorSubject<{ pasos: number; calorias: number }>({ pasos: 0, calorias: 0 });
  public mediaDiaria$ = this.mediaDiariaSource.asObservable();

  private tiempoInicio: number = 0;
  private pasosIniciales: number | null = null;
  private conteoPasosAnterior: number = 0;

  private suscripcionTemporizador: Subscription | null = null;
  private servicioSQLite: SqliteService;
  private seguimientoIniciado = false;  //flag para saber si ya inicio el seguimiento

  constructor(
    private injector: Injector,
    private toastController: ToastController, 
    private logroService: LogroService,
    private pedometer: Pedometer,
    private metaService: MetaService
  ) {
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
    if (this.seguimientoIniciado) {
      return;
    }
    this.seguimientoIniciado = true;
    this.tiempoInicio = Date.now();

    this.pedometer.isStepCountingAvailable().then((available) => {
      if (available) {
        this.pedometer.startPedometerUpdates().subscribe((data) => {
          if (this.pasosIniciales === null) {
            this.pasosIniciales = data.numberOfSteps;
          }
          this.actualizarConteoPasos(data.numberOfSteps);
          this.mostrarMensajeToast(`Pasos actualizados: ${this.conteoPasos}`);
        });
      } else {
        console.log('El podómetro no está disponible en este dispositivo.');
      }
    }).catch((error) => {
      console.error('Error verificando la disponibilidad del podómetro:', error);
    });

    this.iniciarTemporizador();
    console.log('Seguimiento iniciado');
  }

  detenerSeguimiento() {
    if (this.suscripcionTemporizador) {
      this.suscripcionTemporizador.unsubscribe();
      this.suscripcionTemporizador = null;
    }
    this.conteoPasosAnterior = this.conteoPasos;
    this.pedometer.stopPedometerUpdates().then(() => {
      console.log('Seguimiento de pasos detenido');
    }).catch((error) => {
      console.error('Error al detener el seguimiento del podómetro:', error);
    });
  }

  reanudarSeguimiento() {
    this.iniciarTemporizador();
    this.pedometer.startPedometerUpdates().subscribe((data) => {
      this.actualizarConteoPasos(data.numberOfSteps);
      this.mostrarMensajeToast(`Pasos actualizados: ${this.conteoPasos}`);
    });
    console.log('Seguimiento reanudado');
  }

  private verificarMetaDiaria(pasos: number) {
    console.log(`Verificando meta diaria: Meta = ${this.metaDiaria}, Pasos actuales = ${pasos}`);
    if (pasos >= this.metaDiaria) {
      const hoy = new Date().getDate(); // Día actual
      console.log(`Meta diaria alcanzada para el día ${hoy}, pasos: ${pasos}`);
      this.metaService.completeMeta(hoy); // Actualizar la racha de metas
    } else {
      console.log(`Meta diaria no alcanzada: pasos (${pasos}) < meta diaria (${this.metaDiaria})`);
    }
  }
  
  
  private actualizarConteoPasos(pasosActuales: number) {
    if (this.pasosIniciales !== null) {
      this.conteoPasos = this.conteoPasosAnterior + (pasosActuales - this.pasosIniciales);
      this.conteoPasosSource.next(this.conteoPasos);
      this.calcularMetricas();
      this.verificarMetaDiaria(this.conteoPasos);
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

  async calcularMediaDiaria(): Promise<{ pasos: number; calorias: number }> {
    return new Promise((resolve, reject) => {
      this.servicioSQLite.obtenerListaPasos().subscribe({
        next: (data) => {
          if (data.length > 0) {
            const totalPasos = data.reduce((sum, item) => sum + item.conteo_pasos, 0);
            const totalCalorias = data.reduce((sum, item) => sum + item.conteo_pasos * 0.05, 0);

            const media = {
              pasos: Math.round(totalPasos / data.length),
              calorias: Math.round(totalCalorias / data.length),
            };

            this.mediaDiariaSource.next(media);
            resolve(media);
          } else {
            const media = { pasos: 0, calorias: 0 };
            this.mediaDiariaSource.next(media);
            resolve(media);
          }
        },
        error: (err) => {
          console.error('Error al obtener registros para la media diaria:', err);
          reject(err);
        },
      });
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
  
    try {
      // Guardar en historial_actividad y tabla pasos
      await this.servicioSQLite.agregarRegistroHistorial(actividad);
      await this.servicioSQLite.guardarPasos(fecha, this.conteoPasos);
  
      console.log('Datos guardados correctamente. Recalculando media diaria...');
      
      // Recalcular la media diaria
      const mediaDiaria = await this.calcularMediaDiaria();
      console.log('Media diaria recalculada:', mediaDiaria);
  
      // Verificar logros
      await this.logroService.verificarLogros(this.conteoPasos, this.calorias, tiempoTranscurrido);

      if (this.conteoPasos >= this.metaDiaria) {
        const hoy = new Date().getDate();
        console.log(`Meta diaria alcanzada para el día ${hoy}, notificando al MetaService`);
        this.metaService.completeMeta(hoy);
      }

    } catch (error) {
      console.error('Error al guardar progreso:', error);
    }
  }
  

  public incrementarPasos() {
    this.conteoPasos += 1000;
    this.conteoPasosSource.next(this.conteoPasos);
    this.calcularMetricas();
    if (this.conteoPasos % 100 === 0) {
      this.guardarProgreso();
    }
  }

  public resetearPasos() {
    this.conteoPasos = 0;
    this.distancia = 0;
    this.calorias = 0;
    this.conteoPasosSource.next(this.conteoPasos);
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
