import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-informe',
  templateUrl: './informe.page.html',
  styleUrls: ['./informe.page.scss'],
})
export class InformePage implements OnInit {

  constructor(public router:Router, public menu:MenuController) { }

  ngOnInit() {
  }

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
