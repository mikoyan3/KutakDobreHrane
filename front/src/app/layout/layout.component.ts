import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LayoutResponse } from '../models/LayoutResponse';
import { HttpClient } from '@angular/common/http';
import { RestoranService } from '../services/restoran.service';
import { restoran } from '../models/restoran';
import { sto } from '../models/sto';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  
  @Input() layoutData: any; 
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;
  restoran: restoran = null;
  stolovi: sto[] = [];

  constructor(private http: HttpClient, private restoranService: RestoranService) {}

  
  ngOnInit(): void {
    this.restoranService.layout().subscribe((rez: any)=>{
      this.restoran = rez.restoran;
      this.stolovi = rez.stolovi;
      this.ctx = this.canvas.nativeElement.getContext('2d');
      this.drawLayout(this.restoran, this.stolovi);
    })
  }

  private drawLayout(restoran: restoran, stolovi: sto[]): void {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    stolovi.forEach(table => {
      const radius = 25; 
      const centerX = table.x + radius;
      const centerY = table.y + radius;
  
      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      this.ctx.fillStyle = 'yellow';
      this.ctx.fill();
      this.ctx.closePath();
  
      this.ctx.fillStyle = 'black';
      this.ctx.fillText(`Table ${table.id}`, centerX - 15, centerY);
    });

    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(restoran.kitchen.x, restoran.kitchen.y, 75, 200);
    this.ctx.fillStyle = 'black';
    this.ctx.fillText('Kitchen', restoran.kitchen.x, restoran.kitchen.y);

    this.ctx.fillStyle = 'blue';
    this.ctx.fillRect(restoran.toilets.x, restoran.toilets.y, 75, 75);
    this.ctx.fillStyle = 'black';
    this.ctx.fillText('Toilets', restoran.toilets.x, restoran.toilets.y);
  }
}
