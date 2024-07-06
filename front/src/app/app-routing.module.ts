import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { GostComponent } from './gost/gost.component';
import { LoginComponent } from './login/login.component';
import { KonobarComponent } from './konobar/konobar.component';
import { LoginAdminComponent } from './login-admin/login-admin.component';
import { AdminComponent } from './admin/admin.component';
import { RegisterGostComponent } from './register-gost/register-gost.component';
import { LozinkaComponent } from './lozinka/lozinka.component';
import { RestoranComponent } from './restoran/restoran.component';
import { LayoutComponent } from './layout/layout.component';
import { StatistikeComponent } from './statistike/statistike.component';
import { AzurirajprofilComponent } from './azurirajprofil/azurirajprofil.component';
import { DodajkonobaraComponent } from './dodajkonobara/dodajkonobara.component';
import { DodajrestoranComponent } from './dodajrestoran/dodajrestoran.component';

const routes: Routes = [
  { path: "", component: PocetnaComponent },
  { path: "gost", component: GostComponent },
  { path: "login", component: LoginComponent },
  { path: "konobar", component: KonobarComponent},
  { path: "admin", component: LoginAdminComponent},
  { path: "adminDashboard", component: AdminComponent},
  { path: "registerGost", component: RegisterGostComponent},
  { path: "lozinka/:type", component: LozinkaComponent},
  { path: "restoran", component: RestoranComponent},
  { path: "layout", component: LayoutComponent},
  { path: "statistike", component: StatistikeComponent},
  { path: "azurirajprofil", component: AzurirajprofilComponent},
  { path: "dodajKonobara", component: DodajkonobaraComponent},
  { path: "dodajRestoran", component: DodajrestoranComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
