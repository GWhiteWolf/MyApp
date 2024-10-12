import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platform, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SqliteService {
  private database: SQLiteObject | null = null;
  private dbListo: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private listaPasos = new BehaviorSubject<any[]>([]);
  private listaLogros = new BehaviorSubject<any[]>([]);

  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    private toastController: ToastController
  ) {
    this.platform.ready().then(() => {
      this.iniciarBaseDatos();
    });
  }

  async iniciarBaseDatos() {
    try {
      this.database = await this.sqlite.create({
        name: 'activity_tracker.db',
        location: 'default'
      });
      await this.crearTablas();
      this.dbListo.next(true);
    } catch (error) {
      this.mostrarMensaje('Error al iniciar la base de datos');
      console.error('Error initializing database', error);
    }
  }


  async crearTablas() {
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
          fecha_logro TEXT,
          estado TEXT,
          notificado INTEGER DEFAULT 0
        )`, []
      );

      await this.database.executeSql(
        `CREATE TABLE IF NOT EXISTS configuracion_usuario (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          meta_diaria_pasos INTEGER,
          preferencias_notificaciones INTEGER DEFAULT 1,
          fecha_inicio TEXT
        )`, []
      );

      await this.database.executeSql(
        `CREATE TABLE IF NOT EXISTS historial_actividad (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          fecha TEXT,
          pasos_totales INTEGER,
          calorias_quemadas REAL,
          metas_cumplidas INTEGER
        )`, []
      );

      await this.database.executeSql(
        `CREATE TABLE IF NOT EXISTS cache_motivacion (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          frase TEXT,
          autor TEXT,
          fecha_cache TEXT
        )`, []
      );

      this.mostrarMensaje('Tablas creadas');
    } catch (error) {
      this.mostrarMensaje('Error al crear tablas');
      console.error('Error creating tables', error);
    }
  }

  obtenerListaPasos(): Observable<any[]> {
    return this.listaPasos.asObservable();
  }

  obtenerListaLogros(): Observable<any[]> {
    return this.listaLogros.asObservable();
  }


  async cargarListaPasos() {
    if (!this.database) return;
    try {
      const res = await this.database.executeSql(`SELECT * FROM pasos`, []);
      const pasos: any[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        pasos.push(res.rows.item(i));
      }
      this.listaPasos.next(pasos);
    } catch (error) {
      console.error('Error al cargar pasos', error);
    }
  }


  async cargarListaLogros() {
    if (!this.database) return;
    try {
      const res = await this.database.executeSql(`SELECT * FROM logros`, []);
      const logros: any[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        logros.push(res.rows.item(i));
      }
      this.listaLogros.next(logros);
    } catch (error) {
      console.error('Error al cargar logros', error);
    }
  }


  async agregarRegistroPasos(fecha: string, conteoPasos: number, meta: number, mostrarMensaje: boolean = false) {
    if (!this.database) return;
    const sql = `INSERT OR REPLACE INTO pasos (fecha, conteo_pasos, meta, meta_cumplida) VALUES (?, ?, ?, 0)`;
    const values = [fecha, conteoPasos, meta];
    try {
      await this.database.executeSql(sql, values);
      
      // Verifico si se alcanzó la meta
      const metaCumplida = await this.verificarMetaDiaria(fecha, conteoPasos);
      
      if (mostrarMensaje || metaCumplida) {
        this.mostrarMensaje(metaCumplida ? 'Meta alcanzada!' : 'Paso agregado');
      }
      
      this.cargarListaPasos();
    } catch (error) {
      console.error('Error al agregar paso', error);
      if (mostrarMensaje) {
        this.mostrarMensaje('Error al agregar paso');
      }
    }
  }

  async obtenerRegistroPasos(fecha: string) {
    if (!this.database) return null;
    try {
      const res = await this.database.executeSql(`SELECT * FROM pasos WHERE fecha = ?`, [fecha]);
      if (res.rows.length > 0) {
        return res.rows.item(0); 
      }
      return null; 
    } catch (error) {
      console.error('Error al obtener registro de pasos', error);
      return null;
    }
  }
  

  async agregarLogro(nombre: string, fecha: string, estado: string) {
    if (!this.database) return;
    const sql = `INSERT INTO logros (nombre_logro, fecha_logro, estado, notificado) VALUES (?, ?, ?, 0)`;
    const values = [nombre, fecha, estado];
    try {
      await this.database.executeSql(sql, values);
      this.cargarListaLogros();
      this.mostrarMensaje('Logro agregado');
    } catch (error) {
      console.error('Error al agregar logro', error);
      this.mostrarMensaje('Error al agregar logro');
    }
  }

  async marcarLogroNotificado(logroId: number) {
    if (!this.database) return;
    const sql = `UPDATE logros SET notificado = 1 WHERE id = ?`;
    try {
      await this.database.executeSql(sql, [logroId]);
    } catch (error) {
      console.error('Error al marcar logro como notificado', error);
    }
  }


  async verificarMetaDiaria(fecha: string, conteoPasos: number) {
    if (!this.database) return false;
    const sql = `SELECT meta_diaria_pasos FROM configuracion_usuario WHERE id = 1`;
    try {
      const res = await this.database.executeSql(sql, []);
      if (res.rows.length > 0) {
        const metaDiaria = res.rows.item(0).meta_diaria_pasos;
        const metaCumplida = conteoPasos >= metaDiaria ? 1 : 0;

        const updateSql = `UPDATE pasos SET meta_cumplida = ? WHERE fecha = ?`;
        await this.database.executeSql(updateSql, [metaCumplida, fecha]);
        return metaCumplida === 1;
      }
    } catch (error) {
      console.error('Error al verificar meta diaria', error);
    }
    return false;
  }


  async actualizarMetaDiaria(meta: number) {
    if (!this.database) return;
    const fecha = new Date().toISOString();
    const sql = `INSERT OR REPLACE INTO configuracion_usuario (id, meta_diaria_pasos, fecha_inicio) VALUES (1, ?, ?)`;
    const values = [meta, fecha];
    try {
      await this.database.executeSql(sql, values);
      this.mostrarMensaje('Meta diaria actualizada');
    } catch (error) {
      console.error('Error al actualizar meta diaria', error);
      this.mostrarMensaje('Error al actualizar meta diaria');
    }
  }

  async almacenarFraseMotivacion(frase: string, autor: string) {
    if (!this.database) return;
    const fechaCache = new Date().toISOString();
    const sql = `INSERT OR REPLACE INTO cache_motivacion (id, frase, autor, fecha_cache) VALUES (1, ?, ?, ?)`;
    const values = [frase, autor, fechaCache];
    try {
      await this.database.executeSql(sql, values);
      this.mostrarMensaje('Frase motivacional guardada');
    } catch (error) {
      console.error('Error al almacenar frase', error);
    }
  }

async obtenerFraseMotivacion() {
  if (!this.database) return null;
  const sql = `SELECT * FROM cache_motivacion WHERE id = 1`;
  try {
    const res = await this.database.executeSql(sql, []);
    if (res.rows.length > 0) {
      return {
        frase: res.rows.item(0).frase,  
        autor: res.rows.item(0).autor,
        fecha_cache: res.rows.item(0).fecha_cache
      };
    }
    return null; 
  } catch (error) {
    console.error('Error al obtener frase motivacional', error);
    return null; 
  }
}

  async mostrarMensaje(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000
    });
    await toast.present();
  }

  obtenerEstadoBaseDatos() {
    return this.dbListo.asObservable();
  }
}
