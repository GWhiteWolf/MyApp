// logros.page.ts
import { Component, OnInit } from '@angular/core';
import { LogroService } from '../../services/logro.service';
import { Logro } from '../../clases/logro';
import { AlertController } from '@ionic/angular';
import { PasosService } from '../../services/pasos.service'; 
import { NgZone } from '@angular/core';



@Component({
  selector: 'app-logros',
  templateUrl: './logros.page.html',
  styleUrls: ['./logros.page.scss'],
})
export class LogrosPage implements OnInit {
  logros: Logro[] = [];

  constructor(
    private logroService: LogroService,
    private pasosService: PasosService,
    private alertController: AlertController,
    private zone: NgZone
  ) {}

  async ngOnInit() {
    this.cargarLogros();
    await this.verificarLogros();
  }

  async ionViewDidEnter() {
    await this.cargarLogros();
  }

  async cargarLogros() {
    this.logros = await this.logroService.obtenerLogros();
    console.log('Logros actualizados:', this.logros);
  }


  async abrirFormularioLogro(logro?: Logro) {
    const alert = await this.alertController.create({
      header: logro ? 'Editar Logro' : 'Agregar Logro',
      inputs: [
        { name: 'nombre', type: 'text', placeholder: 'Nombre del logro', value: logro?.nombre_logro || '' },
        { name: 'descripcion', type: 'text', placeholder: 'Descripción', value: logro?.descripcion || '' },
        { name: 'tipo', type: 'text', placeholder: 'Tipo (pasos, calorías, tiempo)', value: logro?.tipo || '' },
        { name: 'objetivo', type: 'number', placeholder: 'Objetivo', value: logro?.objetivo || 0 },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: logro ? 'Guardar' : 'Agregar',
          handler: (data) => {
            if (logro) {
              this.actualizarLogro(logro.id, data.nombre, data.descripcion, data.tipo, data.objetivo);
            } else {
              this.agregarLogro(data.nombre, data.descripcion, data.tipo, data.objetivo);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async agregarLogro(nombre: string, descripcion: string, tipo: string, objetivo: number) {
    const nuevoLogro = new Logro(0, nombre, descripcion, tipo, objetivo);
    await this.logroService.agregarLogro(nuevoLogro);
    this.cargarLogros();
  }

  async actualizarLogro(id: number, nombre: string, descripcion: string, tipo: string, objetivo: number) {
    const logroActualizado = new Logro(id, nombre, descripcion, tipo, objetivo, 1);
    await this.logroService.actualizarLogro(logroActualizado);
    this.cargarLogros();
  }

  async eliminarLogro(id: number) {
    await this.logroService.eliminarLogro(id);
    this.cargarLogros();
  }

  async editarLogro(logro: Logro) {
    this.abrirFormularioLogro(logro);
  }

  async verificarLogros() {
    const pasos = this.pasosService.conteoPasos;
    const calorias = this.pasosService.calorias; 
    const tiempo = this.pasosService.obtenerTiempoTranscurrido(); 
  
    const hayLogrosDesbloqueados = await this.logroService.verificarLogros(pasos, calorias, tiempo);
  
    if (hayLogrosDesbloqueados) {
      this.zone.run(() => {
        this.cargarLogros();
      });
    }
  }
  
}
