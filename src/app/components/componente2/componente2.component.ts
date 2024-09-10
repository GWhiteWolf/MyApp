import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-componente2',
  templateUrl: './componente2.component.html',
  styleUrls: ['./componente2.component.scss'],
})
export class Componente2Component  implements OnInit {

  
  @Input() unlocked: boolean = false;
  @Input() description: string = '';
  showParticles: boolean = false;

  constructor() { }

  ngOnInit() {
    if (this.unlocked) {
      this.triggerParticles();
    }
  }

  triggerParticles() {
    this.showParticles = true;
    setTimeout(() => {
      this.showParticles = false;
    }, 3000); // 2 seconds
  }

}
