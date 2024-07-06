import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { konobar } from '../models/konobar';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { last, lastValueFrom } from 'rxjs';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { rezervacija } from '../models/rezervacija';
import { RezervacijeService } from '../services/rezervacije.service';
import { narudzbina } from '../models/narudzbina';
import { NarudzbinaService } from '../services/narudzbina.service';


@Component({
  selector: 'app-konobar',
  templateUrl: './konobar.component.html',
  styleUrls: ['./konobar.component.css']
})
export class KonobarComponent implements OnInit{
  korisnik: konobar;
  fileDownloaded: SafeUrl | null = null;
  fileForUpload: File | null = null;
  ime: string;
  prezime: string;
  adresa: string;
  email: string;
  telefon: string;
  successMessage: string = "";
  errorMessage: string = "";
  flagProfil: boolean = false;
  flagRezervacije: boolean = false;
  flagNarudzbine: boolean = false;
  flagStatistika: boolean = true;
  narudzbine: narudzbina[] = [];
  neobradjeneRezervacije: rezervacija[] = [];
  komentar: string = "";
  errorKomentar: string = "";
  odbijFlag: boolean = false;
  rezervacijeZaPotvrdu: rezervacija[] = [];
  checkBoxFlag: boolean = false;
  minvreme: number = -1;
  errorVreme: string = "";
  dijagramKolona: any[] = [];
  dijagramPita: any[] = [];
  dijagramHistogram: any[] = [];
  broj: number = 0;

  constructor(private userService: UserService, private sanitizer: DomSanitizer, private router: Router, private rezervacijaService: RezervacijeService, private narudzbineService: NarudzbinaService){}

  async ngOnInit(){
    this.successMessage = "";
    this.errorMessage = "";
    this.errorKomentar = "";
    this.odbijFlag = false;
    this.checkBoxFlag = false;
    this.minvreme = -1;
    this.errorVreme = "";
    let br = localStorage.getItem('flag');
    if(br != null) this.broj = JSON.parse(br);
    if(this.broj == 1 || this.broj == 0){
      this.profil()
    } else if (this.broj == 2){
      this.rezervacije();
    } else {
      this.dostave();
    }
    localStorage.removeItem('flag');
    let usr = localStorage.getItem('ulogovan');
    if(usr != null) this.korisnik = JSON.parse(usr);
    this.ime = this.korisnik.name;
    this.prezime = this.korisnik.surname;
    this.adresa = this.korisnik.address;
    this.email = this.korisnik.email;
    this.telefon = this.korisnik.phoneNumber;
    try{
      let data = await lastValueFrom(this.userService.getFileKonobar(this.korisnik.username));
      const blob = new Blob([data]);
      const url = URL.createObjectURL(blob);
      this.fileDownloaded = this.sanitizer.bypassSecurityTrustUrl(url);
      let neobradjeneRezervacije = await lastValueFrom(this.rezervacijaService.getNeobradjeneRezervacije(this.korisnik.restoran));
      this.neobradjeneRezervacije = neobradjeneRezervacije;
      this.neobradjeneRezervacije.sort((a, b) => {
        let dateA = new Date(a.datum);
        let dateB = new Date(b.datum);
    
        return dateA.getTime() - dateB.getTime();
      });
      this.rezervacijeZaPotvrdu = await lastValueFrom(this.rezervacijaService.getRezervacijeZaPotvrdu(this.korisnik.username));
      let narudzbineTren = await lastValueFrom(this.narudzbineService.getTrenutneNarudzbine(this.korisnik.restoran));
      for(let narudzbina of narudzbineTren){
        for(let deo of narudzbina.deoNarudzbine){
          let jelo = await lastValueFrom(this.narudzbineService.getJelo(deo.jelo));
          deo.jeloObjekat = jelo;
        }
      }
      this.narudzbine = narudzbineTren;
    } catch (error){
      console.log(error)
    }
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

  async updateProfile(){
    this.successMessage = "";
    this.errorMessage = "";
    this.korisnik.name = this.ime;
    this.korisnik.surname = this.prezime;
    this.korisnik.address = this.adresa;
    this.korisnik.email = this.email;
    this.korisnik.phoneNumber = this.telefon;
    try{
      let rez = await lastValueFrom(this.userService.updateProfileKonobar(this.korisnik));
      localStorage.removeItem('ulogovan')
      localStorage.setItem('ulogovan', JSON.stringify(rez));
      this.successMessage = "Uspesno ste azurirali profil!"
      if(this.fileForUpload != null){
        let res = await lastValueFrom(this.userService.updatePictureKonobar(this.korisnik.username, this.fileForUpload))
        localStorage.removeItem('ulogovan')
        localStorage.setItem('ulogovan', JSON.stringify(res));
        this.successMessage = "Uspesno ste azurirali profil!";
        let data = await lastValueFrom(this.userService.getFileKonobar(this.korisnik.username))
        const blob = new Blob([data]);
        const url = URL.createObjectURL(blob);
        this.fileDownloaded = this.sanitizer.bypassSecurityTrustUrl(url);
      }
    } catch (error){
      console.log(error)
    }
  }

  profil() {
    this.flagProfil = true;
    this.flagRezervacije = false;
    this.flagNarudzbine = false;
    this.flagStatistika = false;
  }

  rezervacije() {
    this.flagProfil = false;
    this.flagRezervacije = true;
    this.flagNarudzbine = false;
    this.flagStatistika = false;
  }

  dostave() {
    this.flagProfil = false;
    this.flagRezervacije = false;
    this.flagNarudzbine = true;
    this.flagStatistika = false;
  }

  statistika(){
    this.router.navigate(['statistike']);
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
  
    const formattedDate = `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
  
    return formattedDate;
  }

  padWithZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  async potvrdi(id: number){
    try{
      let rezervacija = await lastValueFrom(this.rezervacijaService.getRezervacija(id))
      localStorage.setItem('rezervacija', JSON.stringify(rezervacija));
      this.router.navigate(['layout'])
    } catch(error){
      console.log(error)
    }
  }

  odbijFl(){
    this.odbijFlag = true;
  }

  async odbij(id: number){
    try{
      if(this.komentar == ""){
        this.errorKomentar = "Unos komentara je obavezan!";
      } else {
        let string = await lastValueFrom(this.rezervacijaService.odbijRezervaciju(this.komentar, id, this.korisnik.username));
        this.ngOnInit();
      }
    } catch(error){
      console.log(error)
    }
  }

  async potvrdiDolazak(id: number){
    try{
      let str = await lastValueFrom(this.rezervacijaService.potvrdiDolazak(id));
      this.ngOnInit();
    } catch(error){
      console.log(error)
    }
  }

  async odbijDolazak(id: number){
    try{
      let str = await lastValueFrom(this.rezervacijaService.odbijDolazak(id));
      this.ngOnInit();
    } catch(error){
      console.log(error)
    }
  }

  async odbijNarudzbinu(id: number){
    try{
      let str = await lastValueFrom(this.narudzbineService.odbijNarudzbinu(id));
      this.ngOnInit();
    } catch(error){
      console.log(error)
    }
  }

  prikaziCheckBox(){
    this.checkBoxFlag = true;
  }

  async potvrdiNarudzbinu(id: number){
    try{
      if(this.minvreme == -1){
        this.errorVreme = "Morate odabrati opciju za procenjeno vreme dostave!"
      } else {
        this.errorVreme = "";
        if(this.minvreme == 20){
          let str = await lastValueFrom(this.narudzbineService.potvrdiNarudzbinu(id, 20, 30));
        } else if (this.minvreme == 30){
          let str = await lastValueFrom(this.narudzbineService.potvrdiNarudzbinu(id, 30, 40));
        } else {
          let str = await lastValueFrom(this.narudzbineService.potvrdiNarudzbinu(id, 50, 60));
        }
        this.ngOnInit()
      }
    } catch(error){
      console.log(error)
    }
  }
}
