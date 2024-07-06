import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { restoran } from '../models/restoran';
import { recenzija } from '../models/recenzija';
import { jelo } from '../models/jelo';
import { deoNarudzbine } from '../models/deoNarudzbine';
import { konobar } from '../models/konobar';
import { narudzbina } from '../models/narudzbina';

@Injectable({
  providedIn: 'root'
})
export class NarudzbinaService {

  constructor(private http: HttpClient) { }

  generisiNovuNarudzbinu(delovi: deoNarudzbine[], restoran: string, gost: string){
    let data = {
      delovi: delovi,
      restoran: restoran,
      gost: gost
    }
    return this.http.post<string>("http://localhost:4000/narudzbina/generisiNovuNarudzbinu", data)
  }

  getNarudzbineForGost(gost: string){
    let data = {
      gost: gost
    }
    return this.http.post("http://localhost:4000/narudzbina/getNarudzbineForGost", data)
  }

  getTrenutneNarudzbine(res: string){
    let data = {
      res: res
    }
    return this.http.post<narudzbina[]>("http://localhost:4000/narudzbina/getTrenutneNarudzbine", data)
  }

  odbijNarudzbinu(narudzbina: number){
    let data = {
      narudzbina: narudzbina
    }
    return this.http.post<string>("http://localhost:4000/narudzbina/odbijNarudzbinu", data)
  }

  potvrdiNarudzbinu(narId: number, minVreme: number, maxVreme: number){
    let data = {
      narId: narId,
      minVreme: minVreme,
      maxVreme: maxVreme
    }
    return this.http.post<string>("http://localhost:4000/narudzbina/potvrdiNarudzbinu", data)
  }

  getJelo(jeloId: number){
    let data = {
      jeloId: jeloId
    }
    return this.http.post<jelo>("http://localhost:4000/narudzbina/getJelo", data)
  }
}
