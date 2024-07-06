import { Component, OnInit } from '@angular/core';
import { RestoranService } from '../services/restoran.service';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-dodajrestoran',
  templateUrl: './dodajrestoran.component.html',
  styleUrls: ['./dodajrestoran.component.css']
})
export class DodajrestoranComponent implements OnInit{
  ngOnInit(): void {
    this.errorMessage = "";
  }
  selectedFile: File = null;
  naziv: string = "";
  adresa: string = "";
  tip: string = "";
  telefon: string = "";
  opis: string = "";
  errorMessage: string = "";
  pocetakRadnogVremena: string = "";
  krajRadnogVremena: string = "";

  constructor(private restoranService: RestoranService, private router: Router){}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  async register(){
    let str = await lastValueFrom(this.restoranService.uploadRestoran(this.pocetakRadnogVremena, this.krajRadnogVremena, this.naziv, this.adresa, this.tip, this.telefon, this.opis, this.selectedFile));
    if (str == "Uspesno dodat restoran"){
      this.router.navigate(['adminDashboard'])
    } else {
      this.errorMessage = str;
    }
  }
}
