import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { restoran } from '../models/restoran';

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
}
