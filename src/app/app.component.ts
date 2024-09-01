import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(public router:Router, public menu:MenuController) {}


  cerrarSesion() {
    console.log('Sesión cerrada');
    this.menu.close(); 
    this.router.navigate(['/login']);  
  }

}
