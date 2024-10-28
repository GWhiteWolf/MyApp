// logros.page.ts
import { Component, OnInit } from '@angular/core';
import { LogroService } from '../../services/logro.service';
import { Logro } from '../../clases/logro';
import { ModalController } from '@ionic/angular';
import { FormularioLogroComponent } from '../../components/formulario-logro/formulario-logro.component';
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
    private modalController: ModalController,
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
    const modal = await this.modalController.create({
      component: FormularioLogroComponent,
      componentProps: { logro }
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        const { nombre, descripcion, tipo, objetivo } = result.data;
        if (logro) {
          this.actualizarLogro(logro.id, nombre, descripcion, tipo, objetivo);
        } else {
          this.agregarLogro(nombre, descripcion, tipo, objetivo);
        }
      }
    });

    await modal.present();
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
