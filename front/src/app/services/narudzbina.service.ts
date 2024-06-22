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
}
