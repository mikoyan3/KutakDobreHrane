import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { RestoranService } from '../services/restoran.service';

@Component({
  selector: 'app-pocetna',
  templateUrl: './pocetna.component.html',
  styleUrls: ['./pocetna.component.css']
})
export class PocetnaComponent implements OnInit{
  totalRestorani = 0;
  totalGosti = 0;
  rezervacije24h = 0;
  rezervacije7dana = 0;
  rezervacijeMesec = 0;
  restorani = [];
  konobari = [];
  filteredRestorani = [];
  searchNaziv = '';
  searchAdresa = '';
  searchTip = '';
  sortDirection = 'asc';
  constructor(private router: Router, private userService: UserService, private restoranService: RestoranService){}

  login(){
    this.router.navigate(['login']);
  }

  promenaLozinke(){
    this.router.navigate(['lozinka', 1])
  }

  zaboravljenaLozinka(){
    this.router.navigate(['lozinka', 2])
  }

  ngOnInit(): void{
    this.restoranService.getNumberOfRestoran().subscribe((numRes: any)=>{
      this.totalRestorani = numRes.count;
      this.restoranService.getReservationsLast24Hours().subscribe((numRez24: any)=>{
        this.rezervacije24h = numRez24.count;
        this.restoranService.getReservationsLast7Days().subscribe((numRez7: any)=>{
          this.rezervacije7dana = numRez7.count;
          this.restoranService.getReservationsLastMonth().subscribe((numMes: any)=>{
            this.rezervacijeMesec = numMes.count;
            this.userService.getNumberOfRegisteredGost().subscribe(numGost=>{
              this.totalGosti = numGost;
              this.userService.getAllKonobari().subscribe(kon=>{
                this.konobari = kon;
                this.restoranService.getAllRestorani().subscribe(res=>{
                  this.restorani = res;
                  this.filteredRestorani = this.restorani;
                })
              })
            })
          })
        })
      })
    })
  }

  search(){
    this.filteredRestorani = this.restorani.filter(r=>
      r.naziv.toLowerCase().includes(this.searchNaziv.toLowerCase()) && r.adresa.toLowerCase().includes(this.searchAdresa.toLowerCase()) && r.tip.toLowerCase().includes(this.searchTip.toLowerCase())
    )
  }

  sort(column: string){
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.filteredRestorani.sort((a, b) => {
      if (a[column] < b[column]) return this.sortDirection === 'asc' ? -1 : 1;
      if (a[column] > b[column]) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  getKonobariForRestoran(restoran: any): any[]{
    return this.konobari.filter(konobar=> konobar.restoran === restoran.naziv);
  }
}
