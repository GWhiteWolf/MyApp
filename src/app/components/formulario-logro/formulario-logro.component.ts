import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Logro } from '../../clases/logro';

@Component({
  selector: 'app-formulario-logro',
  templateUrl: './formulario-logro.component.html',
  styleUrls: ['./formulario-logro.component.scss']
})
export class FormularioLogroComponent implements OnInit {
  @Input() logro?: Logro;
  logroForm: FormGroup;

  constructor(
    private modalController: ModalController,
    private formBuilder: FormBuilder
  ) {
    this.logroForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      tipo: ['', Validators.required],
      objetivo: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit() {
    if (this.logro) {
      this.logroForm.patchValue({
        nombre: this.logro.nombre_logro,
        descripcion: this.logro.descripcion,
        tipo: this.logro.tipo,
        objetivo: this.logro.objetivo,
      });
    }
  }

  cancelar() {
    this.modalController.dismiss();
  }

  guardar() {
    if (this.logroForm.valid) {
      const data = this.logroForm.value;
      this.modalController.dismiss({
        nombre: data.nombre,
        descripcion: data.descripcion,
        tipo: data.tipo,
        objetivo: data.objetivo,
      });
    }
  }
}
