import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { konobar } from '../models/konobar';
import { gost } from '../models/gost';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string, userRole: string){
    let data = {
      username: username,
      password: password,
      userRole: userRole
    }
    return this.http.post("http://localhost:4000/users/login", data)
  }

  login_admin(username: string, password: string){
    let data = {
      username: username,
      password: password
    }
    return this.http.post("http://localhost:4000/users/login_admin", data)
  }

  registerGost(username: string, password: string, securityQuestion: string, securityAnswer: string, name: string, surname: string, gender: string, address: string, phoneNumber: string, email: string, file: File, creditCardNumber: string): Observable<any>{
    const formData = new FormData();
    formData.append('file', file);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('securityQuestion', securityQuestion);
    formData.append('securityAnswer', securityAnswer);
    formData.append('name', name);
    formData.append('surname', surname);
    formData.append('gender', gender);
    formData.append('address', address);
    formData.append('phoneNumber', phoneNumber);
    formData.append('email', email);
    formData.append('creditCardNumber', creditCardNumber);
    return this.http.post<string>("http://localhost:4000/users/registerGost", formData);
  }

  promenaLozinke(username: string, password: string, newPassword: string){
    let data = {
      username: username,
      password: password,
      newPassword: newPassword
    }
    return this.http.post("http://localhost:4000/users/promenaLozinke", data)
  }

  dohvatanjeKorisnikaNaOsnovuUsername(username: string){
    let data = {
      username: username
    }
    return this.http.post("http://localhost:4000/users/dohvatanjeKorisnikaNaOsnovuUsername", data)
  }

  novaLozinka(username: string, newPassword: string){
    let data = {
      username: username,
      newPassword: newPassword
    }
    return this.http.post("http://localhost:4000/users/novaLozinka", data)
  }

  getNumberOfRegisteredGost(){
    return this.http.get<number>("http://localhost:4000/users/getNumberOfRegisteredGost");
  }

  getAllKonobari(){
    return this.http.get<konobar[]>("http://localhost:4000/users/getAllKonobari");
  }

  getFileGost(username: string): Observable<ArrayBuffer>{
    let data = {
      username: username
    }
    return this.http.post("http://localhost:4000/users/getFileGost", data, { responseType: 'arraybuffer'})
  }

  getFileKonobar(username: string): Observable<ArrayBuffer>{
    let data = {
      username: username
    }
    return this.http.post("http://localhost:4000/users/getFileKonobar", data, { responseType: 'arraybuffer'})
  }

  private baseUrl = 'http://localhost:4000/users'; 

  updateProfileGost(user: gost): Observable<any> {
    return this.http.put<gost>(`${this.baseUrl}/updateProfileGost/${user.username}`, user);
  }

  updatePictureGost(username: string, file: File){
    const formData = new FormData();
    formData.append('file', file);
    formData.append('username', username)
    return this.http.post("http://localhost:4000/users/updatePictureGost", formData);
  }

  updateProfileKonobar(user: konobar): Observable<any> {
    return this.http.put<konobar>(`${this.baseUrl}/updateProfileKonobar/${user.username}`, user);
  }

  updatePictureKonobar(username: string, file: File){
    const formData = new FormData();
    formData.append('file', file);
    formData.append('username', username)
    return this.http.post("http://localhost:4000/users/updatePictureKonobar", formData);
  }

  getInfoForStatistics(konobar: string, restoran: string){
    let data = {
      konobar: konobar,
      restoran: restoran
    }
    return this.http.post("http://localhost:4000/users/getInfoForStatistics", data);
  }
}
