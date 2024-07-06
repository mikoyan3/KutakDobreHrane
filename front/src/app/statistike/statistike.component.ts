import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { last, lastValueFrom } from 'rxjs';
import { konobar } from '../models/konobar';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { ChartConfiguration } from 'chart.js';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-statistike',
  templateUrl: './statistike.component.html',
  styleUrls: ['./statistike.component.css']
})
export class StatistikeComponent implements OnInit{
  @ViewChild('histogram') histogramChart: ElementRef;
  @ViewChild('column') columnChart: ElementRef;
  @ViewChild('pie') pieChart: ElementRef;
  chartHistogram: any;
  chartColumn: any;
  chartPie: any;
  korisnik: konobar;
  dijagramKolona: any[] = [];
  dijagramPita: any[] = [];
  dijagramHistogram: any[] = [];
  constructor(private userService: UserService, private router: Router){}
  async ngOnInit(){
    let usr = localStorage.getItem('konobarUlogovan');
    if(usr != null) this.korisnik = JSON.parse(usr);
    let povratna: any = await lastValueFrom(this.userService.getInfoForStatistics(this.korisnik.username, this.korisnik.restoran));
    this.dijagramHistogram = povratna.dijagramHistogram;
    this.dijagramKolona = povratna.dijagramKolona;
    this.dijagramPita = povratna.dijagramPita;
    this.incijalizuj();
  }

  profil(){
    localStorage.setItem('flag', JSON.stringify(1));
    this.router.navigate(['konobar']);
  }
  rezervacije(){
    localStorage.setItem('flag', JSON.stringify(2));
    this.router.navigate(['konobar']);
  }
  dostave(){
    localStorage.setItem('flag', JSON.stringify(3));
    this.router.navigate(['konobar']);
  }
  statistika(){
    this.router.navigate(['statistike'])
  }
  incijalizuj(){
    this.renderColumnChart();
    this.renderHistogramChart();
    this.renderPieChart();
  }

  renderHistogramChart() {
    const ctx = this.histogramChart.nativeElement.getContext('2d');
    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: Object.keys(this.dijagramHistogram),
        datasets: [{
          label: 'Prosecan broj gostiju za dati dan u nedelji',
          data: Object.values(this.dijagramHistogram),
          backgroundColor: '#8561a8',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              precision: 0
            }
          }
        }
      }
    };
    this.chartHistogram = new Chart(ctx, config);
  }

  renderColumnChart() {
    const ctx = this.columnChart.nativeElement.getContext('2d');
    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: Object.keys(this.dijagramKolona),
        datasets: [{
          label: 'Broj gostiju',
          data: Object.values(this.dijagramKolona),
          backgroundColor: '#8561a8',
          borderColor: '#64427a',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y:{
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              precision: 0
            }
          }
        }
      }
    };
    this.chartColumn = new Chart(ctx, config);
  }

  renderPieChart() {
    const ctx = this.pieChart.nativeElement.getContext('2d');
    const colors = [];
    for(let i = 0; i < this.dijagramPita.length; i++){
      let color = this.getColor();
      colors.push(color)
    }
    const config: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: this.dijagramPita.map(item => item.username),
        datasets: [{
          label: 'Ukupan broj gostiju za datog konobara',
          data: this.dijagramPita.map(item => item.sumBrojGostiju),
          backgroundColor: colors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    };
    this.chartPie = new Chart(ctx, config)
  }

  getColor(){
    const rnd = '0123456789ABCDEF';
    let color = '#';
    for(let i = 0; i < 6; i++){
      color += rnd[Math.floor(Math.random() * 16)]
    }
    return color;
  }
}
