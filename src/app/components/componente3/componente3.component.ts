import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-componente3',
  templateUrl: './componente3.component.html',
})
export class ResetPasswordModalComponent {
  email: string = "";

  constructor(private modalController: ModalController, private alertController: AlertController) {}

  dismiss() {
    this.modalController.dismiss();
  }

  async enviarCorreo() {
    if (this.validarEmail(this.email)) {
      const alert = await this.alertController.create({
        header: 'Correo enviado',
        message: 'Se ha enviado un enlace de restablecimiento de contraseña a tu correo.',
        buttons: ['OK'],
      });
      await alert.present();
      this.dismiss();
    } else {
      const alert = await this.alertController.create({
        header: 'Correo inválido',
        message: 'Por favor, ingresa un correo electrónico válido.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  validarEmail(email: string): boolean {
    // Expresión regular para validar un correo electrónico
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
}
