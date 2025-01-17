import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { CommonModule, DatePipe } from '@angular/common';
import { GostComponent } from './gost/gost.component';
import { LoginComponent } from './login/login.component';
import { KonobarComponent } from './konobar/konobar.component';
import { AdminComponent } from './admin/admin.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { RegisterGostComponent } from './register-gost/register-gost.component';
import { LozinkaComponent } from './lozinka/lozinka.component';
import { RestoranComponent } from './restoran/restoran.component';
import { LayoutComponent } from './layout/layout.component';
import { StatistikeComponent } from './statistike/statistike.component';
import { AzurirajprofilComponent } from './azurirajprofil/azurirajprofil.component';
import { DodajkonobaraComponent } from './dodajkonobara/dodajkonobara.component';
import { DodajrestoranComponent } from './dodajrestoran/dodajrestoran.component';

@NgModule({
  declarations: [
    AppComponent,
    PocetnaComponent,
    GostComponent,
    LoginComponent,
    KonobarComponent,
    AdminComponent,
    LoginAdminComponent,
    RegisterGostComponent,
    LozinkaComponent,
    RestoranComponent,
    LayoutComponent,
    StatistikeComponent,
    AzurirajprofilComponent,
    DodajkonobaraComponent,
    DodajrestoranComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    CommonModule
  ],
  providers: [
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
