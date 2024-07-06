import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  message: string = "";
  username: string = "";
  password: string = "";
  userRole: string = "";

  constructor(private userService: UserService, private router: Router){}
  
  login(){
    if(this.username == "" || this.password == "" || this.userRole == ""){
      this.message = "Niste uneli sve informacije!"
    } else {
      this.userService.login(this.username, this.password, this.userRole).subscribe((rez: any)=>{
        if(rez.userType == "gost"){
          this.message = "";
          localStorage.setItem('gostUlogovan', JSON.stringify(rez.user));
          this.router.navigate(['gost']);
        } else if(rez.userType == "konobar"){
          this.message = "";
          localStorage.setItem('konobarUlogovan', JSON.stringify(rez.user));
          this.router.navigate(['konobar']);
        } else {
          this.message = rez.userType;
        }
      })
    }
  }

  registerGost(){
    this.router.navigate(['registerGost']);
  }
}
