import { Injectable } from '@angular/core';
import { SqliteService } from './sqlite.service';
import { Logro } from '../clases/logro';

@Injectable({
  providedIn: 'root'
})
export class LogroService {
  constructor(private sqliteService: SqliteService) {}

  async agregarLogro(logro: Logro) {
    await this.sqliteService.agregarLogro(logro);
  }

  async obtenerLogros() {
    return this.sqliteService.obtenerLogros();
  }

  // logro.service.ts

async actualizarLogro(logro: Logro) {
  const sql = `
    UPDATE logros SET nombre_logro = ?, descripcion = ?, tipo = ?, objetivo = ? 
    WHERE id = ?
  `;
  await this.sqliteService.ejecutarConsulta(sql, [logro.nombre_logro, logro.descripcion, logro.tipo, logro.objetivo, logro.id]);
}

async eliminarLogro(id: number) {
  const sql = `DELETE FROM logros WHERE id = ?`;
  await this.sqliteService.ejecutarConsulta(sql, [id]);
}


  async verificarLogros(pasos: number, calorias: number, tiempo: number) {
    const logros = await this.sqliteService.obtenerLogros();
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
          await this.sqliteService.desbloquearLogro(logro.id);
          console.log(`Logro desbloqueado: ${logro.nombre_logro}`);
        }
      }
    }
  }
}
