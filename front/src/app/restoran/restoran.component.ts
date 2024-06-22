import { Component, OnInit } from '@angular/core';
import { restoran } from '../models/restoran';
import { recenzija } from '../models/recenzija';
import { RestoranService } from '../services/restoran.service';
import { Router } from '@angular/router';
import { gost } from '../models/gost';
import { jelo } from '../models/jelo';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { deoNarudzbine } from '../models/deoNarudzbine';
import { forkJoin } from 'rxjs';
import { NarudzbinaService } from '../services/narudzbina.service';

@Component({
  selector: 'app-restoran',
  templateUrl: './restoran.component.html',
  styleUrls: ['./restoran.component.css']
})
export class RestoranComponent implements OnInit{
  restoran: restoran = null;
  recenzije: recenzija[] = [];
  reservation = {
    date: '',
    people: 1,
    requests: ''
  };
  validationMessage: string = '';
  validationMessageSuccess: string = '';
  isReservationValid: boolean = true;
  gost: gost = null;
  jelovnik: jelo[] = [];
  korpa: deoNarudzbine[] = [];
  slikeJela: { [key: number]: SafeUrl } = {};
  message: string = "";

  constructor(private restoranService: RestoranService, private router: Router, private sanitizer: DomSanitizer, private narudzbinaService: NarudzbinaService){}
  
  ngOnInit(): void {
    this.message = "";
    let rest = localStorage.getItem('restoran');
    let usr = localStorage.getItem('ulogovan');
    if (usr != null) this.gost = JSON.parse(usr);
    this.restoranService.getRestoranWithNaziv(rest).subscribe(rez => {
      this.restoran = rez;
      this.restoranService.getRecenzijeForRestoran(rest).subscribe(rec => {
        this.recenzije = rec;
        this.restoranService.getJelaForRestoran(this.restoran.naziv).subscribe(jela => {
          this.jelovnik = jela;
          this.fetchAllImages();
        });
      });
    });
  }

  makeReservation(){
    const date = new Date(this.reservation.date);
    const now = new Date();

    if(date < now){
      this.validationMessage = 'Datum i vreme ne mogu biti u proslosti!'
      this.isReservationValid = false;
      return;
    }
    if(this.reservation.people < 1){
      this.validationMessage = 'Broj osoba ne moze biti manji od 1!';
      this.isReservationValid = false;
      return;
    }

    this.restoranService.kreirajRezervaciju(date, this.reservation.people, this.reservation.requests, this.restoran.naziv, this.gost.username).subscribe(rez=>{
      if(rez == "Uspesno ste poslali zahtev za rezervacijom!"){
        this.validationMessage = '';
        this.validationMessageSuccess = rez;
      } else {
        this.validationMessageSuccess = '';
        this.validationMessage = rez;
      }
    })
  }

  fetchAllImages() {
    const imageRequests = this.jelovnik.map(jelo => this.restoranService.getSlikaJelo(jelo.id));
    forkJoin(imageRequests).subscribe(results => {
      results.forEach((data, index) => {
        const blob = new Blob([data]);
        const url = URL.createObjectURL(blob);
        const fileDownloaded = this.sanitizer.bypassSecurityTrustUrl(url);
        this.slikeJela[this.jelovnik[index].id] = fileDownloaded;
      });
    });
  }

  dodajUKorpu(jelo: jelo){
    let cena = jelo.cena * jelo.kolicina;
    let deo: deoNarudzbine = new deoNarudzbine()
    deo.jelo = jelo.id;
    deo.kolicina = jelo.kolicina;
    deo.cena = cena;
    deo.jeloObjekat = jelo;
    this.korpa.push(deo);
  }

  ukloniIzKorpe(item: deoNarudzbine) {
    const index = this.korpa.indexOf(item);
    if (index > -1) {
      this.korpa.splice(index, 1);
    }
  }

  zavrsiPorudzbinu(){
    this.narudzbinaService.generisiNovuNarudzbinu(this.korpa, this.restoran.naziv, this.gost.username).subscribe(rez=>{
      this.message = rez;
      this.korpa = [];
    })
  }
}