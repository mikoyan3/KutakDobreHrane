import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { restoran } from '../models/restoran';
import { recenzija } from '../models/recenzija';
import { jelo } from '../models/jelo';
import { deoNarudzbine } from '../models/deoNarudzbine';
import { rezervacija } from '../models/rezervacija';

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

  getNeobradjeneRezervacije(restoran: string){
    let data = {
      restoran: restoran
    }
    return this.http.post<rezervacija[]>("http://localhost:4000/rezervacije/getNeobradjeneRezervacije", data)
  }

  getRezervacija(id: number){
    let data = {
      id: id
    }
    return this.http.post<rezervacija>("http://localhost:4000/rezervacije/getRezervacija", data)
  }

  potvrdiRezervaciju(rezId: number, sto: number, konobar: string){
    let data = {
      rezId: rezId,
      sto: sto,
      konobar: konobar
    }
    return this.http.post<string>("http://localhost:4000/rezervacije/potvrdiRezervaciju", data)
  }

  odbijRezervaciju(komentar: string, rezId: number, konobar: string){
    let data = {
      komentar: komentar,
      rezId: rezId,
      konobar: konobar
    }
    return this.http.post<string>("http://localhost:4000/rezervacije/odbijRezervaciju", data)
  }

  getRezervacijeZaPotvrdu(konobar: string){
    let data = {
      konobar: konobar
    }
    return this.http.post<rezervacija[]>("http://localhost:4000/rezervacije/getRezervacijeZaPotvrdu", data)
  }

  potvrdiDolazak(rezId: number){
    let data = {
      rezId: rezId
    }

    return this.http.post<string>("http://localhost:4000/rezervacije/potvrdiDolazak", data)
  }
}
