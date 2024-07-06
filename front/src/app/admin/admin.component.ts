import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LayoutResponse } from '../models/LayoutResponse';
import { konobar } from '../models/konobar';
import { gost } from '../models/gost';
import { restoran } from '../models/restoran';
import { UserService } from '../services/user.service';
import { RestoranService } from '../services/restoran.service';
import { lastValueFrom } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit{
  gostiFlag: boolean = true;
  konobariFlag: boolean = false;
  restoraniFlag: boolean = false;
  konobari: konobar[] = [];
  odobreniGosti: gost[] = [];
  zahteviGosti: gost[] = [];
  restorani: restoran[] = [];
  constructor(private userService: UserService, private restoranService: RestoranService, private router: Router) {}
  
  
  async ngOnInit(){
    let data: any = await lastValueFrom(this.userService.fetchAllInfoAdministrator());
    this.konobari = data.konobari;
    this.odobreniGosti = data.odobreniGosti;
    this.zahteviGosti = data.zahteviGosti;
    this.restorani = data.restorani;
  }


  gosti(){
    this.gostiFlag = true;
    this.konobariFlag = false;
    this.restoraniFlag = false;
  }
  
  konobariB(){
    this.gostiFlag = false;
    this.konobariFlag = true;
    this.restoraniFlag = false;
  }

  restoraniB(){
    this.gostiFlag = false;
    this.konobariFlag = false;
    this.restoraniFlag = true;
  }

  dodajKonobara(){
    this.router.navigate(['dodajKonobara'])
  }

  dodajRestoran(){
    this.router.navigate(['dodajRestoran']);
  }
  
  azurirajGost(gost: gost){
    localStorage.setItem('azuriraj', JSON.stringify(gost));
    localStorage.setItem('tipAzuriranja', JSON.stringify(1));
    this.router.navigate(['azurirajprofil']);
  }

  azurirajKonobar(konobar: konobar){
    localStorage.setItem('azuriraj', JSON.stringify(konobar));
    localStorage.setItem('tipAzuriranja', JSON.stringify(2));
    this.router.navigate(['azurirajprofil']);
  }

  getKonobariForRestoran(restoran: any): any[]{
    return this.konobari.filter(konobar=> konobar.restoran === restoran.naziv);
  }

  async potvrdi(username: string){
    let str = await lastValueFrom(this.userService.prihvatiKorisnika(username));
    this.ngOnInit();
  }

  async odbij(username: string){
    let str = await lastValueFrom(this.userService.odbijKorisnika(username));
    this.ngOnInit();
  }
}
