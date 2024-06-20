import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { gost } from '../models/gost';

@Component({
  selector: 'app-lozinka',
  templateUrl: './lozinka.component.html',
  styleUrls: ['./lozinka.component.css']
})
export class LozinkaComponent implements OnInit{
  formType: number;
  oldPassword: string = "";
  newPassword: string = "";
  confirmNewPassword: string = "";
  errorMessage: string = "";
  errorMessageSig: string = "";
  username: string = "";
  showSecurityQuestion: boolean = false;
  securityQuestion: string = "";
  securityAnswer: string = "";
  securityQuestionError: string = "";
  showNewPasswordForm: boolean = false;
  korisnik: gost;

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) { }
  ngOnInit(): void {
    this.route.params.subscribe(params=>{
      this.formType = +params['type'];
    })
  }

  promenaLozinke(){
    if(this.oldPassword == this.newPassword){
      this.errorMessage = "Nova i stara lozinka su iste!";
      return;
    } 
    if(this.newPassword != this.confirmNewPassword){
      this.errorMessage = "Nova lozinka i ponovljena nova lozinka se ne podudaraju!";
      return;
    }
    const passwordRegex = /^(?=[a-zA-Z])(?=.*[A-Z])(?=.*[a-z].*[a-z].*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,10}$/;
    if(passwordRegex.test(this.newPassword) != true){
      this.errorMessage = "Nova lozinka nije u odgovarajucem formatu!";
      return;
    }
    if(this.username == "" || this.oldPassword == "" || this.newPassword == "" || this.confirmNewPassword == ""){
      this.errorMessage = "Niste uneli sve podatke!";
      return;
    }
    this.userService.promenaLozinke(this.username, this.oldPassword, this.newPassword).subscribe((rez: any)=>{
      if(rez.user != null){
        this.errorMessage = "";
        this.router.navigate(['']);
      } else {
        this.errorMessage = rez.message;
      }
    })
  }

  dohvatiSigurnosnoPitanje(){
    if(this.username == ""){
      this.errorMessage = "Niste uneli sve podatke!";
      return;
    }
    this.userService.dohvatanjeKorisnikaNaOsnovuUsername(this.username).subscribe((rez: any)=>{
      if(rez.user == null){
        this.errorMessage = "Korisnik ne postoji!";
      } else {
        this.errorMessage = "";
        this.korisnik = rez.user;
        this.securityQuestion = this.korisnik.securityQuestion;
        this.showSecurityQuestion = true;
      }
    })
  }

  proveriSigurnosnoPitanje(){
    if(this.securityAnswer == ""){
      this.securityQuestionError = "Niste uneli sve podatke!";
      return;
    }
    if(this.securityAnswer != this.korisnik.securityAnswer){
      this.securityQuestionError = "Odgovor na sigurnosno pitanje nije tacno!";
      return;
    }
    this.securityQuestionError = "";
    this.showNewPasswordForm = true;
  }

  promenaLozinkeSigurnosnoPitanje(){
    if(this.newPassword != this.confirmNewPassword){
      this.errorMessageSig = "Nova lozinka i ponovljena nova lozinka se ne podudaraju!";
      return;
    }
    const passwordRegex = /^(?=[a-zA-Z])(?=.*[A-Z])(?=.*[a-z].*[a-z].*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{6,10}$/;
    if(passwordRegex.test(this.newPassword) != true){
      this.errorMessageSig = "Nova lozinka nije u odgovarajucem formatu!";
      return;
    }
    if(this.confirmNewPassword == "" || this.newPassword == ""){
      this.errorMessageSig = "Niste uneli sve podatke!";
      return;
    }
    this.userService.novaLozinka(this.username, this.newPassword).subscribe((rez: any)=>{
      if(rez.user != null){
        this.errorMessageSig = "";
        this.router.navigate(['']);
      } else {
        this.errorMessageSig = rez.message;
      }
    })
  }
}
