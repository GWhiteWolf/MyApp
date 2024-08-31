import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public router:Router) { }

  botonHome(){
    this.router.navigate(['/home']);
  }

  botonInforme(){
    this.router.navigate(['/informe']);
  }

  botonLogros(){
    this.router.navigate(['/logros']);
  }

}
