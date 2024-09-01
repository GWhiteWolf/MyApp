import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-logros',
  templateUrl: './logros.page.html',
  styleUrls: ['./logros.page.scss'],
})
export class LogrosPage implements OnInit {

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
