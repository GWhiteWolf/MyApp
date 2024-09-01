import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public router:Router, public menu:MenuController) { }

  botonHome(){
    this.router.navigate(['/home']);
  }

  botonInforme(){
    this.router.navigate(['/informe']);
  }

  botonLogros(){
    this.router.navigate(['/logros']);
  }

  abrirMenu() {
    this.menu.open('first');
  }

}
