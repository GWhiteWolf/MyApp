import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(public router:Router) {}

  boton1(){
    this.router.navigate(['/home']);
  }

  boton2(){
    this.router.navigate(['/informe']);
  }

  boton3(){
    this.router.navigate(['/home']);
  }
}
