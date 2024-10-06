import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-componente1',
  templateUrl: './componente1.component.html',
  styleUrls: ['./componente1.component.scss'],
})
export class Componente1Component implements OnInit {

  constructor(private menu: MenuController) { }

  abrirMenu() {
    this.menu.open('first');
  }

  ngOnInit() {}
}
