import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { restoran } from '../models/restoran';
import { RestoranService } from '../services/restoran.service';
import { last, lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-dodajkonobara',
  templateUrl: './dodajkonobara.component.html',
  styleUrls: ['./dodajkonobara.component.css']
})
export class DodajkonobaraComponent implements OnInit{
  username: string = "";
  password: string = "";
  securityQuestion: string = "";
  securityAnswer: string = "";
  name: string = "";
  surname: string = "";
  gender: string = ""; 
  address: string = "";
  phoneNumber: string = "";
  email: string = "";
  restoran: string = "";
  errorMessage: string = "";
  fileForUpload: File | null = null;
  restorani: restoran[] = [];

  constructor(private userService: UserService, private router: Router, private restoranService: RestoranService){}
  async ngOnInit(){
    this.restorani = await lastValueFrom(this.restoranService.getAllRestorani());
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

  register(){
    const passwordRegex = /^(?=[a-zA-Z])(?=.*[A-Z])(?=.*[a-z].*[a-z].*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,10}$/;
    if(this.username == "" || this.password == "" || this.securityQuestion == "" || this.securityAnswer == "" || this.name == "" || this.surname == "" || this.gender == "" || this.address == "" || this.phoneNumber == "" || this.email == "" || this.restoran == "") {
      this.errorMessage = "Niste uneli sve potrebne podatke!"
    } else {
      if(passwordRegex.test(this.password) != true){
        this.errorMessage = "Lozinka nije u odgovarajucem formatu!"
      } else {
        this.errorMessage = ""
        this.userService.registerKonobar(this.username, this.password, this.securityQuestion, this.securityAnswer, this.name, this.surname, this.gender, this.address, this.phoneNumber, this.email, this.fileForUpload, this.restoran).subscribe(response=>{
          if(response == "Uspesno ste poslali zahtev za registracijom!"){
            this.router.navigate(['adminDashboard']);
          } else {
            this.errorMessage = response;
          }
        })
      }
    }
  }
}
