import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { restoran } from '../models/restoran';
import { recenzija } from '../models/recenzija';
import { jelo } from '../models/jelo';
import { deoNarudzbine } from '../models/deoNarudzbine';

@Injectable({
  providedIn: 'root'
})
export class RezervacijeService {

  constructor(private http: HttpClient) { }

  getAktuelneRezervacije(gost: string){
    let data = {
      gost: gost
    }
    return this.http.post("http://localhost:4000/rezervacije/getAktuelneRezervacije", data)
  }

  getArhiviraneRezervacije(gost: string){
    let data = {
      gost: gost
    }
    return this.http.post("http://localhost:4000/rezervacije/getArhiviraneRezervacije", data)
  }

  otkaziRezervaciju(id: number){
    let data = {
      id: id
    }
    return this.http.post("http://localhost:4000/rezervacije/otkaziRezervaciju", data)
  }

  ostaviRecenziju(id: number, komentar: string, ocena: number, restoran: string){
    let data = {
      id: id,
      komentar: komentar,
      ocena: ocena,
      restoran: restoran
    }
    return this.http.post<string>("http://localhost:4000/rezervacije/ostaviRecenziju", data)
  }
}
