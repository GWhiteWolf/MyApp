import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageComponentPage } from './page-component.page';

const routes: Routes = [
  {
    path: '',
    component: PageComponentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageComponentPageRoutingModule {}
