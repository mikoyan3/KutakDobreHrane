import { Component, OnInit } from '@angular/core';
import { gost } from '../models/gost';
import { konobar } from '../models/konobar';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { last, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-azurirajprofil',
  templateUrl: './azurirajprofil.component.html',
  styleUrls: ['./azurirajprofil.component.css']
})
export class AzurirajprofilComponent implements OnInit{
  gost: gost = null;
  konobar: konobar = null;
  tip: number = 0;
  ime: string;
  prezime: string;
  adresa: string;
  email: string;
  telefon: string;
  kreditnaKartica: string;
  fileDownloaded: SafeUrl | null = null;
  fileForUpload: File | null = null;
  errorMessage: string = "";
  successMessage: string = "";
  flagGost: boolean = true;
  
  constructor(private userService: UserService, private router: Router, private sanitizer: DomSanitizer, ) {}

  async ngOnInit(){
    this.errorMessage = "";
    this.successMessage = "";
    let t = localStorage.getItem('tipAzuriranja')
    if(t != null) this.tip = JSON.parse(t);
    if (this.tip == 1){
      this.flagGost = true;
      let usr = localStorage.getItem('azuriraj');
      if(usr != null) this.gost = JSON.parse(usr);
      this.kreditnaKartica = this.gost.creditCardNumber;
      this.ime = this.gost.name;
      this.prezime = this.gost.surname;
      this.adresa = this.gost.address;
      this.email = this.gost.email;
      this.telefon = this.gost.phoneNumber;

    } else if (this.tip == 2){
      this.flagGost = false;
      let usr = localStorage.getItem('azuriraj');
      if(usr != null) this.konobar = JSON.parse(usr);
      this.ime = this.konobar.name;
      this.prezime = this.konobar.surname;
      this.adresa = this.konobar.address;
      this.email = this.konobar.email;
      this.telefon = this.konobar.phoneNumber;
    }
    try{
      if(this.tip == 1){
        console.log(this.gost.username);
        let data = await lastValueFrom(this.userService.getFileGost(this.gost.username));
        const blob = new Blob([data]);
        const url = URL.createObjectURL(blob);
        this.fileDownloaded = this.sanitizer.bypassSecurityTrustUrl(url);
      } else if(this.tip == 2){
        let data = await lastValueFrom(this.userService.getFileKonobar(this.konobar.username));
        const blob = new Blob([data]);
        const url = URL.createObjectURL(blob);
        this.fileDownloaded = this.sanitizer.bypassSecurityTrustUrl(url);
      }
    } catch (error){
      console.log(error);
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
    this.errorMessage = "";
    this.successMessage = "";
    if (this.tip == 1){
      this.gost.name = this.ime;
      this.gost.surname = this.prezime;
      this.gost.address = this.adresa;
      this.gost.email = this.email;
      this.gost.phoneNumber = this.telefon;
      this.gost.creditCardNumber= this.kreditnaKartica;
      try{
        let rez = await lastValueFrom(this.userService.updateProfileGost(this.gost));
        this.gost = rez;
        this.successMessage = "Uspesno ste azurirali profil!"
        if(this.fileForUpload != null){
          let res = await lastValueFrom(this.userService.updatePictureGost(this.gost.username, this.fileForUpload));
          localStorage.removeItem('azuriraj');
          localStorage.setItem('azuriraj', JSON.stringify(res));
          this.successMessage = "Uspesno ste azurirali profil!";
          let data = await lastValueFrom(this.userService.getFileGost(this.gost.username))
          const blob = new Blob([data]);
          const url = URL.createObjectURL(blob);
          this.fileDownloaded = this.sanitizer.bypassSecurityTrustUrl(url);
        }
      } catch(error){
        console.log(error);
      }
    }else if(this.tip == 2){
      this.konobar.name = this.ime;
      this.konobar.surname = this.prezime;
      this.konobar.address = this.adresa;
      this.konobar.email = this.email;
      this.konobar.phoneNumber = this.telefon;
      try{
        let rez = await lastValueFrom(this.userService.updateProfileKonobar(this.konobar));
        this.konobar = rez;
        this.successMessage = "Uspesno ste azurirali profil!"
        if(this.fileForUpload != null){
          let res = await lastValueFrom(this.userService.updatePictureKonobar(this.konobar.username, this.fileForUpload));
          localStorage.removeItem('azuriraj');
          localStorage.setItem('azuriraj', JSON.stringify(res));
          this.successMessage = "Uspesno ste azurirali profil!";
          let data = await lastValueFrom(this.userService.getFileKonobar(this.konobar.username))
          const blob = new Blob([data]);
          const url = URL.createObjectURL(blob);
          this.fileDownloaded = this.sanitizer.bypassSecurityTrustUrl(url);
        }
      } catch(error){
        console.log(error);
      }
    }
  }

  povratakNaDashBoard(){
    localStorage.removeItem('tipAzuriranja');
    localStorage.removeItem('azuriraj');
    this.router.navigate(['adminDashboard']);
  }
}
