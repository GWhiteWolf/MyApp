import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { Componente1Component } from './components/componente1/componente1.component'; // Asegúrate de importar tu componente

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./pages/registro/registro.module').then(m => m.RegistroPageModule)
  },
  {
    path: '',
    component: Componente1Component,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'informe',
        loadChildren: () => import('./pages/informe/informe.module').then(m => m.InformePageModule)
      },
      {
        path: 'logros',
        loadChildren: () => import('./pages/logros/logros.module').then(m => m.LogrosPageModule)
      }
    ]
  },
  { path: '**', component: PageNotFoundComponent } // Ruta para el 404
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
