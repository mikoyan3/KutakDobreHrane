import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent {
  username: string = ""
  password: string = ""
  message: string = ""
  constructor(private userService: UserService, private router: Router){}

  login(){
    if(this.username == "" || this.password == ""){
      this.message = "Niste uneli sve informacije!"
    } else {
      this.userService.login_admin(this.username, this.password).subscribe((rez: any)=>{
        if(rez.message == "Uspesno"){
          this.message = "";
          localStorage.setItem('admin', JSON.stringify(rez.user));
          this.router.navigate(['adminDashboard']);
        } else {
          this.message = rez.message;
        }
      })
    }
  }
}
