import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logros',
  templateUrl: './logros.page.html',
  styleUrls: ['./logros.page.scss'],
})
export class LogrosPage implements OnInit {

  constructor(public router:Router) { }

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

}
