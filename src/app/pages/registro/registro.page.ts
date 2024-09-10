import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage {

  // Modelo para el formulario de registro
  register:any = {
    usuario: "",
    password: ""
  };

  field: string = "";

  constructor(public router: Router, public toastController: ToastController) { }

  // Método para registrar un nuevo usuario
  async registrar() {
    if (this.validateModel(this.register)) {

      // Guardar el nuevo usuario en localStorage
      localStorage.setItem(this.register.usuario, JSON.stringify(this.register));

      this.presentToast('top', 'Cuenta creada exitosamente!');

      // Redireccionar al login
      this.router.navigate(['/login']);
    } else {
      this.presentToast('bottom', 'Error: Falta ' + this.field, 4000);
    }
  }

  // Validación de campos
  validateModel(model:any) {
    for (const [key, value] of Object.entries(model)) {
      if (value === "") {
        this.field = key;
        return false;
      }
    }
    return true;
  }

  // Método para mostrar un toast
  async presentToast(position: 'top' | 'middle' | 'bottom', msg: string, duration?: number) {
    const toast = await this.toastController.create({
      message: msg,
      duration: duration ? duration : 2500,
      position: position,
    });

    await toast.present();
  }
}
