import { Component, OnInit } from '@angular/core';
import { restoran } from '../models/restoran';
import { recenzija } from '../models/recenzija';
import { RestoranService } from '../services/restoran.service';
import { Router } from '@angular/router';
import { gost } from '../models/gost';

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

  constructor(private restoranService: RestoranService, private router: Router){}
  
  ngOnInit(): void {
    let rest = localStorage.getItem('restoran');
    let usr = localStorage.getItem('ulogovan');
    if(usr != null) this.gost = JSON.parse(usr);
    this.restoranService.getRestoranWithNaziv(rest).subscribe(rez=>{
      this.restoran = rez;
      this.restoranService.getRecenzijeForRestoran(rest).subscribe(rec=>{
        this.recenzije = rec;
      })
    })
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
}
