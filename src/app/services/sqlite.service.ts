import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Pasos } from '../clases/pasos';
import { Logro } from '../clases/logro';
import { HistorialActividad } from '../clases/historial-actividad';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  private database: SQLiteObject | null = null;
  private dbListo: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private listaPasos = new BehaviorSubject<Pasos[]>([]);
  private listaHistorial = new BehaviorSubject<HistorialActividad[]>([]);

  constructor(
    private platform: Platform,
    private sqlite: SQLite
  ) {
    this.platform.ready().then(() => {
      this.iniciarBaseDatos();
    });
  }

  async iniciarBaseDatos() {
    try {
      this.database = await this.sqlite.create({
        name: 'contador.db',
        location: 'default'
      });
      await this.crearTablas();
      this.dbListo.next(true);
      console.log('Base de datos inicializada correctamente');
    } catch (error) {
      console.error('Error al iniciar la base de datos', error);
    }
  }

  private async crearTablas() {
    if (!this.database) return;
    try {
      await this.database.executeSql(
        `CREATE TABLE IF NOT EXISTS pasos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          fecha TEXT UNIQUE,
          conteo_pasos INTEGER,
          meta INTEGER,
          meta_cumplida INTEGER DEFAULT 0
        )`, []
      );

      await this.database.executeSql(
        `CREATE TABLE IF NOT EXISTS logros (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nombre_logro TEXT,
          descripcion TEXT,
          tipo TEXT, -- Ej: 'pasos', 'calorias', 'tiempo'
          objetivo INTEGER,
          estado INTEGER DEFAULT 0,
          icono TEXT DEFAULT 'lock-closed-outline'
        )`, []
      );

      await this.database.executeSql(
        `CREATE TABLE IF NOT EXISTS historial_actividad (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          fecha TEXT,
          pasos_totales INTEGER,
          calorias_quemadas REAL,
          distancia_recorrida REAL,
          tiempo_actividad INTEGER,
          metas_cumplidas INTEGER
        )`, []
      );

      console.log('Tablas creadas');
    } catch (error) {
      console.error('Error al crear tablas', error);
    }
  }

  obtenerEstadoBaseDatos(): Observable<boolean> {
    return this.dbListo.asObservable();
  }

  obtenerListaPasos(): Observable<Pasos[]> {
    return this.listaPasos.asObservable();
  }

  obtenerListaHistorial(): Observable<HistorialActividad[]> {
    return this.listaHistorial.asObservable();
  }

  async cargarListaPasos() {
    if (!this.database) return;
    try {
      const res = await this.database.executeSql(`SELECT * FROM pasos`, []);
      const pasos: Pasos[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        pasos.push(res.rows.item(i));
      }
      this.listaPasos.next(pasos);
      console.log('Lista de pasos cargada desde la base de datos:', pasos);
    } catch (error) {
      console.error('Error al cargar la lista de pasos desde la base de datos:', error);
    }
  }

  async cargarHistorialActividad() {
    if (!this.database) return;
    try {
      const res = await this.database.executeSql(`SELECT * FROM historial_actividad`, []);
      const historial: HistorialActividad[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        historial.push(res.rows.item(i));
      }
      this.listaHistorial.next(historial);
      console.log('Historial de actividad cargado:', historial);
    } catch (error) {
      console.error('Error al cargar el historial de actividad:', error);
    }
  }

  async agregarRegistroHistorial(actividad: HistorialActividad) {
    if (!this.database) return;

    const sql = `
      INSERT OR REPLACE INTO historial_actividad 
      (fecha, pasos_totales, calorias_quemadas, distancia_recorrida, tiempo_actividad, metas_cumplidas) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      actividad.fecha, 
      actividad.pasosTotales, 
      actividad.caloriasQuemadas, 
      actividad.distanciaRecorrida, 
      actividad.tiempoActividad, 
      actividad.metasCumplidas
    ];

    try {
      await this.database.executeSql(sql, values);
      console.log("Registro de actividad guardado exitosamente:", actividad);
      this.cargarHistorialActividad();
    } catch (error) {
      console.error('Error al agregar registro de actividad en la base de datos:', error);
    }
  }

  async verificarMetaDiaria(fecha: string, conteoPasos: number): Promise<boolean> {
    if (!this.database) return false;
    const sql = `SELECT meta_diaria_pasos FROM configuracion_usuario WHERE id = 1`;
    try {
      const res = await this.database.executeSql(sql, []);
      if (res.rows.length > 0) {
        const metaDiaria = res.rows.item(0).meta_diaria_pasos;
        const metaCumplida = conteoPasos >= metaDiaria ? 1 : 0;

        const updateSql = `UPDATE historial_actividad SET metas_cumplidas = ? WHERE fecha = ?`;
        await this.database.executeSql(updateSql, [metaCumplida, fecha]);

        return metaCumplida === 1;
      }
    } catch (error) {
      console.error('Error al verificar meta diaria', error);
    }
    return false;
  }

  async resetearProgreso() {
    if (!this.database) return;
    try {
      await this.database.executeSql(`DELETE FROM historial_actividad`, []);
      this.cargarHistorialActividad();
      console.log('Historial de actividad reseteado');
    } catch (error) {
      console.error('Error al resetear el progreso en la base de datos', error);
    }
  }

  async agregarLogro(logro: Logro) {
    const sql = `
      INSERT INTO logros (nombre_logro, descripcion, tipo, objetivo, estado, icono)
      VALUES (?, ?, ?, ?, 0, 'lock-closed-outline')
    `;
    const values = [logro.nombre_logro, logro.descripcion, logro.tipo, logro.objetivo];
  
    if (this.database) {
      await this.database.executeSql(sql, values);
    } else {
      console.error('error agregar logro');
    }
  }
  
  
  async obtenerLogros(): Promise<Logro[]> {
    if (!this.database) {
      console.error('error obtener logros');
      return [];
    }
  
    const res = await this.database.executeSql(`SELECT * FROM logros`, []);
    const logros: Logro[] = [];
    for (let i = 0; i < res.rows.length; i++) {
      logros.push(res.rows.item(i));
    }
    return logros;
  }
  
  
  async desbloquearLogro(id: number) {
    const sql = `UPDATE logros SET estado = 1, icono = 'trophy' WHERE id = ?`;
    if (this.database) {
      await this.database.executeSql(sql, [id]);
    } else {
      console.error('error desbloquear logro');
    }
  }
  
  // sqlite.service.ts

async ejecutarConsulta(sql: string, params: any[] = []): Promise<any> {
  if (!this.database) {
    console.error('error ejecutar consulta');
    return;
  }
  return this.database.executeSql(sql, params);
}

}
