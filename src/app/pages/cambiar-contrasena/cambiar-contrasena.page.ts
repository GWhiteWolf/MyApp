import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.page.html',
  styleUrls: ['./cambiar-contrasena.page.scss'],
})
export class CambiarContrasenaPage {

  // Modelo para el formulario de cambio de contraseña
  cambiarContrasena: any = {
    usuario: "",
    passwordActual: "",
    nuevaContrasena: "",
  };

  field: string = "";

  constructor(public router: Router, public toastController: ToastController) { }

  async cambiar() {
    if (this.validateModel(this.cambiarContrasena)) {
      const savedUser = localStorage.getItem(this.cambiarContrasena.usuario);
      if (savedUser) {
        const user = JSON.parse(savedUser);
        if (user.password === this.cambiarContrasena.passwordActual) {
          user.password = this.cambiarContrasena.nuevaContrasena;
          localStorage.setItem(this.cambiarContrasena.usuario, JSON.stringify(user));
          this.presentToast('top', 'Contraseña cambiada exitosamente!');
          this.router.navigate(['/login']);
        } else {
          this.presentToast('bottom', 'Contraseña actual incorrecta', 4000);
        }
      } else {
        this.presentToast('bottom', 'Usuario no encontrado', 4000);
      }
    } else {
      this.presentToast('bottom', 'Error: Falta ' + this.field, 4000);
    }
  }

  // Validación de campos
  validateModel(model: any) {
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
