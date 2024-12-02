import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-componente3',
  templateUrl: './componente3.component.html',
})
export class ResetPasswordModalComponent {
  email: string = "";

  constructor(
    private modalController: ModalController, 
    private alertController: AlertController
  ) {}

  dismiss() {
    this.modalController.dismiss();
  }

  async enviarCorreo() {
    if (this.validarEmail(this.email)) {
      const templateParams = {
        mensaje1: 'Recibimos una solicitud para restablecer tu contraseña. Si realizaste esta solicitud, accede al siguiente enlace para completar el proceso:',
        to_email: this.email, // Correo ingresado por el usuario
        from_name: 'StepCounter App',
      };

      try {
        emailjs.init('yeRrEdYg_evfF-8GF');

        // enviar el correo usando el Service ID y Template ID
        const response = await emailjs.send(
          'service_iww6hj6',
          'template_4twvqnj',
          templateParams
        );

        console.log('Correo enviado:', response.status, response.text);

        const alert = await this.alertController.create({
          header: 'Correo enviado',
          message: 'Se ha enviado un enlace de restablecimiento de contraseña a tu correo.',
          buttons: ['OK'],
        });
        await alert.present();
        this.dismiss();
      } catch (error) {
        console.error('Error al enviar el correo:', error);

        // Mostrar mensaje de error
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'No se pudo enviar el correo. Inténtalo nuevamente más tarde.',
          buttons: ['OK'],
        });
        await alert.present();
      }
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
