// logro.service.ts
import { Injectable } from '@angular/core';
import { SqliteService } from './sqlite.service';
import { Logro } from '../clases/logro';
import { ToastController } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/local-notifications';

@Injectable({
  providedIn: 'root'
})
export class LogroService {
  constructor(
    private sqliteService: SqliteService,
    private toastController: ToastController
  ) {}

  async agregarLogro(logro: Logro) {
    await this.sqliteService.agregarLogro(logro);
  }

  async obtenerLogros() {
    return this.sqliteService.obtenerLogros();
  }

  async actualizarLogro(logro: Logro) {
    const sql = `
      UPDATE logros SET nombre_logro = ?, descripcion = ?, tipo = ?, objetivo = ? 
      WHERE id = ?
    `;
    await this.sqliteService.ejecutarConsulta(sql, [
      logro.nombre_logro,
      logro.descripcion,
      logro.tipo,
      logro.objetivo,
      logro.id
    ]);
  }

  async eliminarLogro(id: number) {
    const sql = `DELETE FROM logros WHERE id = ?`;
    await this.sqliteService.ejecutarConsulta(sql, [id]);
  }

  async desbloquearLogro(logroId: number) {
    const sql = `UPDATE logros SET estado = 1 WHERE id = ?`; // cambiar estado a 1 (desbloqueado)
    await this.sqliteService.ejecutarConsulta(sql, [logroId]);
  }

  private async mostrarMensajeToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      position: 'top'
    });
    await toast.present();
  }

  async verificarLogros(pasos: number, calorias: number, tiempo: number) {
    const logros = await this.sqliteService.obtenerLogros();
    let hayLogrosDesbloqueados = false;
  
    for (const logro of logros) {
      if (logro.estado === 0) {
        let cumplido = false;
  
        if (logro.tipo === 'pasos' && pasos >= logro.objetivo) {
          cumplido = true;
        } else if (logro.tipo === 'calorias' && calorias >= logro.objetivo) {
          cumplido = true;
        } else if (logro.tipo === 'tiempo' && tiempo >= logro.objetivo) {
          cumplido = true;
        }
  
        if (cumplido) {
          await this.desbloquearLogro(logro.id);
          this.mostrarMensajeToast(`Logro desbloqueado: ${logro.nombre_logro}`);
          await this.mostrarNotificacionLogro(logro.nombre_logro);
          hayLogrosDesbloqueados = true;
        }
      }
    }
  
    return hayLogrosDesbloqueados;
  }

  async mostrarNotificacionLogro(nombreLogro: string) {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: '¡Felicidades!',
          body: `Has desbloqueado el logro: ${nombreLogro}`,
          id: 1, // id unico
          schedule: { at: new Date(Date.now() + 1000) }, // 1 segundo después
          sound: undefined,
          attachments: undefined,
          actionTypeId: '',
          extra: null
        }
      ]
    });
  }
  
}
