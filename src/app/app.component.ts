import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  nombreUsuario: string = '';

  constructor(public router: Router, public menu: MenuController) {
    // para escuchar los cambios de ruta
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.nombreUsuario = localStorage.getItem('usuario') || 'Nombre de Usuario';
      }
    });
  }

  isLoginPage() {
    return this.router.url === '/login';
  }

  cerrarSesion() {
    localStorage.removeItem('usuario');
    this.menu.close('first').then(() => {
      this.router.navigate(['/login']);
    });
  }
}

