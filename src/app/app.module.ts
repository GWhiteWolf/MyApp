import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { HttpClientModule } from '@angular/common/http';


import { SQLite } from '@awesome-cordova-plugins/sqlite/ngx';
import { PasosService } from './services/pasos.service';
import { SqliteService } from './services/sqlite.service';
import { MetaService } from './services/meta.service';

import { Pedometer } from '@ionic-native/pedometer/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';



@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
  ],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, SQLite ,PasosService, SqliteService, Pedometer, AndroidPermissions, MetaService,],
  bootstrap: [AppComponent, HttpClientModule],
})
export class AppModule {}
