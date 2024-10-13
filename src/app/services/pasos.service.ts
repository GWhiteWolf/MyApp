import { Injectable, Injector } from '@angular/core';
import { Subscription, interval } from 'rxjs';
import { SqliteService } from './sqlite.service';

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

  constructor(private injector: Injector) {
    this.servicioSQLite = this.injector.get(SqliteService);
  }

  iniciarSeguimiento() {
    this.tiempoInicio = Date.now();
    this.iniciarTemporizador();
    console.log('Seguimiento iniciado');
  }

  detenerSeguimiento() {
    if (this.suscripcionTemporizador) {
      this.suscripcionTemporizador.unsubscribe();
      this.suscripcionTemporizador = null; 
      console.log('Seguimiento detenido');
    }
  }

  private calcularMetricas() {
    const longitudPaso = 0.78; 
    this.distancia = (this.conteoPasos * longitudPaso) / 1000;
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
      console.log('Registros de pasos obtenidos para el cálculo de media:', data);

      if (data.length > 0) {
        const totalPasos = data.reduce((sum, item) => sum + item.conteo_pasos, 0);
        const totalCalorias = data.reduce((sum, item) => sum + (item.conteo_pasos * 0.05), 0);
  
        this.mediaDiaria.pasos = Math.round(totalPasos / data.length);
        this.mediaDiaria.calorias = Math.round(totalCalorias / data.length);
  
        console.log('Media Diaria Calculada sin filtro de umbral:', {
          pasosPromedio: this.mediaDiaria.pasos,
          caloriasPromedio: this.mediaDiaria.calorias
        });
      } else {
        console.log('No hay registros para calcular la media diaria.');
      }
    });
  }
  
  

  public async guardarProgreso() {
    const fecha = new Date().toISOString();
    const tiempoTranscurrido = this.obtenerTiempoTranscurrido();
  
    await this.servicioSQLite.agregarRegistroPasos(
      fecha,
      this.conteoPasos,
      10000,
      this.calorias,
      this.distancia,
      tiempoTranscurrido,
      true
    );
    
    await this.servicioSQLite.verificarMetaDiaria(fecha, this.conteoPasos);
    this.calcularMediaDiaria();
    console.log(`Datos guardados: ${this.conteoPasos} pasos, ${this.distancia.toFixed(2)} km, ${this.calorias.toFixed(2)} cal, ${tiempoTranscurrido} mins`);
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
    console.log('Progreso reseteado en la base de datos');
  }

  public obtenerTiempoTranscurrido(): number {
    return Math.floor((Date.now() - this.tiempoInicio) / 1000 / 60);
  }
}
