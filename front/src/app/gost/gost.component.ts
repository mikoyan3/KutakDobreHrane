import { Component, OnInit } from '@angular/core';
import { gost } from '../models/gost';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserService } from '../services/user.service';
import { RestoranService } from '../services/restoran.service';

@Component({
  selector: 'app-gost',
  templateUrl: './gost.component.html',
  styleUrls: ['./gost.component.css']
})
export class GostComponent implements OnInit{
  korisnik: gost;
  fileDownloaded: SafeUrl | null = null;
  fileForUpload: File | null = null;
  ime: string;
  prezime: string;
  adresa: string;
  email: string;
  telefon: string;
  kreditnaKartica: string;
  errorMessage: string = "";
  successMessage: string = ""
  flagProfil: boolean = true;
  flagRestoran: boolean = false;
  restorani = [];
  konobari = [];
  filteredRestorani = [];
  searchNaziv = '';
  searchAdresa = '';
  searchTip = '';
  sortDirection = 'asc';

  constructor(private userService: UserService, private sanitizer: DomSanitizer, private restoranService: RestoranService){}

  ngOnInit(): void {
    this.errorMessage = "";
    this.successMessage = "";
    let usr = localStorage.getItem('ulogovan');
    if(usr != null) this.korisnik = JSON.parse(usr);
    this.ime = this.korisnik.name;
    this.prezime = this.korisnik.surname;
    this.adresa = this.korisnik.address;
    this.email = this.korisnik.email;
    this.telefon = this.korisnik.phoneNumber;
    this.kreditnaKartica = this.korisnik.creditCardNumber;
    this.userService.getFileGost(this.korisnik.username).subscribe(data=>{
      const blob = new Blob([data]);
      const url = URL.createObjectURL(blob);
      this.fileDownloaded = this.sanitizer.bypassSecurityTrustUrl(url);
      this.restoranService.getAllRestoraniWithRatings().subscribe(res=>{
        this.restorani = res;
        this.filteredRestorani = this.restorani;
        this.userService.getAllKonobari().subscribe(kon=>{
          this.konobari = kon;
        })
      })
    })
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    const reader = new FileReader();

    reader.onload=(e)=>{
      const img = new Image();
      img.onload=()=>{
        const width = img.width;
        const height = img.height;
        if(width < 100 || height < 100 || width > 300 || height > 300){
          this.errorMessage = "Profilna slika nije odgovarajucih dimenzija";
          this.fileForUpload = null;
        } else {
          this.errorMessage = ""
          this.fileForUpload = file;
        }
      }
      img.src = e.target.result.toString();
    }
    reader.readAsDataURL(file);
  }

  updateProfile() {
    this.korisnik.name = this.ime;
    this.korisnik.surname = this.prezime;
    this.korisnik.address = this.adresa;
    this.korisnik.email = this.email;
    this.korisnik.phoneNumber = this.telefon;
    this.korisnik.creditCardNumber = this.kreditnaKartica;
  
    this.userService.updateProfileGost(this.korisnik).subscribe(rez=>{
      localStorage.removeItem('ulogovan')
      localStorage.setItem('ulogovan', JSON.stringify(rez));
      this.successMessage = "Uspesno ste azurirali profil!"
      if(this.fileForUpload != null){
        this.userService.updatePictureGost(this.korisnik.username, this.fileForUpload).subscribe(res=>{
          localStorage.removeItem('ulogovan')
          localStorage.setItem('ulogovan', JSON.stringify(res));
          this.successMessage = "Uspesno ste azurirali profil!"
          this.userService.getFileGost(this.korisnik.username).subscribe(data=>{
            const blob = new Blob([data]);
            const url = URL.createObjectURL(blob);
            this.fileDownloaded = this.sanitizer.bypassSecurityTrustUrl(url);
          })
        })
      }
    })
  }
  
  profil(){
    this.flagProfil = true;
    this.flagRestoran = false;
  }

  restoraniShow(){
    this.flagProfil = false;
    this.flagRestoran = true;
  }
  rezervacije(){}
  dostavaHrane(){}

  search() {
    this.filteredRestorani = this.restorani.filter(r =>
      r.naziv.toLowerCase().includes(this.searchNaziv.toLowerCase()) && r.adresa.toLowerCase().includes(this.searchAdresa.toLowerCase()) && r.tip.toLowerCase().includes(this.searchTip.toLowerCase())
    );
  }

  sort(column: string) {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.filteredRestorani.sort((a, b) => {
      if (a[column] < b[column]) return this.sortDirection === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  getKonobariForRestoran(restoran: any): any[] {
    return this.konobari.filter(konobar => konobar.restoran === restoran.naziv);
  }

  getStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0).map((x, i) => i);
  }
}
