import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { restoran } from '../models/restoran';
import { recenzija } from '../models/recenzija';
import { jelo } from '../models/jelo';
import { rezervacija } from '../models/rezervacija';

@Injectable({
  providedIn: 'root'
})
export class RestoranService {

  constructor(private http: HttpClient) { }

  getNumberOfRestoran(){
    return this.http.get("http://localhost:4000/restoran/getNumberOfRestoran")
  }

  getReservationsLast24Hours(){
    return this.http.get("http://localhost:4000/restoran/getReservationsLast24Hours")
  }

  getReservationsLast7Days(){
    return this.http.get("http://localhost:4000/restoran/getReservationsLast7Days")
  }

  getReservationsLastMonth(){
    return this.http.get("http://localhost:4000/restoran/getReservationsLastMonth")
  }

  getAllRestorani(){
    return this.http.get<restoran[]>("http://localhost:4000/restoran/getAllRestorani")
  }

  getAllRestoraniWithRatings(): Observable<any>{
    return this.http.get("http://localhost:4000/restoran/getAllRestoraniWithRatings")
  }

  getRestoranWithNaziv(naziv: string){
    let data = {
      naziv: naziv
    }
    return this.http.post<restoran>("http://localhost:4000/restoran/getRestoranWithNaziv", data)
  }

  getRecenzijeForRestoran(naziv: string){
    let data = {
      naziv: naziv
    }
    return this.http.post<recenzija[]>("http://localhost:4000/restoran/getRecenzijeForRestoran", data)
  }

  kreirajRezervaciju(datum: Date, brojOsoba: number, opis: string, restoran: string, gost: string){
    let data = {
      datum: datum,
      brojOsoba: brojOsoba,
      opis: opis,
      restoran: restoran,
      gost: gost
    }
    return this.http.post<string>("http://localhost:4000/restoran/kreirajRezervaciju", data)
  }

  getJelaForRestoran(restoran: string){
    let data = {
      restoran: restoran
    }
    return this.http.post<jelo[]>("http://localhost:4000/restoran/getJelaForRestoran", data)
  }

  getSlikaJelo(jeloId: number): Observable<ArrayBuffer>{
    let data = {
      jeloId: jeloId
    }
    return this.http.post("http://localhost:4000/restoran/getSlikaJelo", data, { responseType: 'arraybuffer'})
  }

  getLayoutForRestoran(rezervacija: rezervacija){
    let data = {
      rezervacija: rezervacija
    }
    return this.http.post("http://localhost:4000/restoran/getLayoutForRestoran", data)
  }
}
