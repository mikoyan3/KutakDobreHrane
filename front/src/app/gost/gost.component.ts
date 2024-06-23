import { Component, OnInit } from '@angular/core';
import { gost } from '../models/gost';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserService } from '../services/user.service';
import { RestoranService } from '../services/restoran.service';
import { Router } from '@angular/router';
import { rezervacija } from '../models/rezervacija';
import { RezervacijeService } from '../services/rezervacije.service';
import { DatePipe } from '@angular/common';
import { NarudzbinaService } from '../services/narudzbina.service';

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
  rezervacijeFlag: boolean = false;
  dostavaHraneFlag: boolean = false;
  restorani = [];
  konobari = [];
  filteredRestorani = [];
  searchNaziv = '';
  searchAdresa = '';
  searchTip = '';
  sortDirection = 'asc';
  aktuelneNarudzbine = [];
  arhiviraneNarudzbine = [];
  aktuelneRezervacije: rezervacija[] = []; 
  arhiviraneRezervacije: rezervacija[] = [];
  reviewFormId: number | null = null; 
  noviKomentar: string = ''; 
  rating: number = 0; 
  reviewFormRestoran: string = '';
  success: string = '';
  fail: string = '';
  constructor(private narudzbineService: NarudzbinaService,private datePipe: DatePipe, private userService: UserService, private sanitizer: DomSanitizer, private restoranService: RestoranService, private router: Router, private rezervacijeService: RezervacijeService){}

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
          this.rezervacijeService.getAktuelneRezervacije(this.korisnik.username).subscribe((rez: any)=>{
            if(rez.message == "Nema aktuelnih rezervacija"){
              this.aktuelneRezervacije = [];
            } else {
              rez.rezervacije.forEach(r=>{
                rez.stolovi.forEach(s=>{
                  rez.restorani.forEach(rst=>{
                    if(r.sto == s.id && s.restoran == rst.naziv){
                      let newRez: rezervacija = new rezervacija();
                      newRez.adresa = rst.adresa;
                      newRez.brojGostiju = r.brojGostiju;
                      newRez.datum = r.datum;
                      newRez.gost = r.gost;
                      newRez.id = r.id;
                      newRez.komentarKonobara = r.komentarKonobara;
                      newRez.opis = r.opis;
                      newRez.restoran = rst.naziv;
                      newRez.status = r.status;
                      newRez.sto = r.sto;
                      this.aktuelneRezervacije.push(newRez);
                    }
                  })
                })
              })
            }
            this.rezervacijeService.getArhiviraneRezervacije(this.korisnik.username).subscribe((arh: any)=>{
              if(arh.message == "Nema arhiviranih rezervacija!"){
                this.arhiviraneRezervacije = [];
              }else{
                this.arhiviraneRezervacije = arh.rezervacije.map(rezervacija=>{
                  let sto = arh.stolovi.find(sto=>sto.id === rezervacija.sto);
                  let restoran = sto ? sto.restoran : '';
                  let recenzija = arh.recenzije.find(rec => rec.rezervacijaId === rezervacija.id);
                  let komentar = recenzija ? recenzija.komentar : '';
                  let ocena = recenzija ? recenzija.ocena : 0;
                  return{
                    ...rezervacija,
                    restoran: restoran,
                    komentar: komentar,
                    ocena: ocena
                  };
                });
                this.arhiviraneRezervacije.forEach(arhivirana=>{
                  if(!arhivirana.komentar){
                    arhivirana.komentar = '';
                  }
                  if(!arhivirana.ocena){
                    arhivirana.ocena = 0;
                  }
                })
              }
              this.narudzbineService.getNarudzbineForGost(this.korisnik.username).subscribe((nar: any)=>{
                this.arhiviraneNarudzbine = nar.arhivirane;
                this.aktuelneNarudzbine = nar.aktuelne;
                this.arhiviraneNarudzbine.sort((a, b) => {
                  let dateA = new Date(a.datum);
                  let dateB = new Date(b.datum);
              
                  return dateB.getTime() - dateA.getTime();
              });
              })
            })
          })
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
    this.rezervacijeFlag = false;
    this.dostavaHraneFlag = false;
  }

  restoraniShow(){
    this.flagProfil = false;
    this.flagRestoran = true;
    this.rezervacijeFlag = false;
    this.dostavaHraneFlag = false;
  }
  rezervacije(){
    this.rezervacijeFlag = true;
    this.flagProfil = false;
    this.flagRestoran = false;
    this.dostavaHraneFlag = false;
  }
  dostavaHrane(){
    this.dostavaHraneFlag = true;
    this.flagProfil = false;
    this.rezervacijeFlag = false;
    this.flagRestoran = false;
  }

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

  pregledajRestoran(naziv: string){
    localStorage.setItem('restoran', naziv);
    this.router.navigate(['restoran']);
  }

  isOtkaziva(datum: Date): boolean{
    const dat = new Date(datum)
    dat.setHours(dat.getHours() - 2);
    const now = new Date();
    const futureTime = new Date(now.getTime() + 45 * 60000);
    return dat.getTime() >= futureTime.getTime();
  }

  formatDate(datum: Date): string {
    let date = new Date(datum);
    date.setHours(date.getHours() - 2);
    const month = this.padWithZero(date.getMonth() + 1); 
    const day = this.padWithZero(date.getDate());
    const year = date.getFullYear();
    let hours = this.padWithZero(date.getHours());
    const minutes = this.padWithZero(date.getMinutes());
    const seconds = this.padWithZero(date.getSeconds());
  
    const formattedDate = `${month}.${day}.${year} ${hours}:${minutes}:${seconds}`;
  
    return formattedDate;
  }
  
  padWithZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  otkaziRezervaciju(id: number){
    this.rezervacijeService.otkaziRezervaciju(id).subscribe(rez=>{
      this.ngOnInit();
    })
  }

  submitReview(): void{
    this.rezervacijeService.ostaviRecenziju(this.reviewFormId, this.noviKomentar, this.rating, this.reviewFormRestoran).subscribe(rez=>{
      if(rez == "Uspesno ste ostavili recenziju!"){
        this.fail = "";
        this.success = rez;
      } else {
        this.success = "";
        this.fail = rez;
      }
      this.reviewFormId = null;
      this.noviKomentar = '';
      this.rating = 0;
    })
  }

  openReviewForm(reservation: rezervacija): void {
    this.reviewFormId = reservation.id;
    this.reviewFormRestoran = reservation.restoran;
    this.noviKomentar = ''; 
    this.rating = 0; 
  }

  setRating(rating: number): void {
    this.rating = rating;
  }
}
