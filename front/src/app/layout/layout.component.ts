import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LayoutResponse } from '../models/LayoutResponse';
import { HttpClient } from '@angular/common/http';
import { RestoranService } from '../services/restoran.service';
import { restoran } from '../models/restoran';
import { sto } from '../models/sto';
import { rezervacija } from '../models/rezervacija';
import { last, lastValueFrom } from 'rxjs';
import { RezervacijeService } from '../services/rezervacije.service';
import { konobar } from '../models/konobar';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  
  @Input() layoutData: any; 
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D;
  korisnik: konobar = null;
  restoran: restoran = null;
  zauzetiStolovi: sto[] = [];
  slobodniStolovi: sto[] = [];
  rezervacija: rezervacija = null;
  odgovarajuciStolovi: sto[] = [];
  selectedStoId: number = -1;
  message: string = "";
  success: string = "";
  flagCompleted: boolean = false;
  constructor(private http: HttpClient, private restoranService: RestoranService, private rezervacijaService: RezervacijeService) {}

  
  async ngOnInit(){
    try{
      this.flagCompleted = false;
      this.success = "";
      this.selectedStoId = -1;
      this.message = "";
      let rez = localStorage.getItem('rezervacija')
      if(rez != null) this.rezervacija = JSON.parse(rez);
      let kon = localStorage.getItem('konobarUlogovan');
      if(kon != null) this.korisnik = JSON.parse(kon);
      let rezultat: any = await lastValueFrom(this.restoranService.getLayoutForRestoran(this.rezervacija))
      this.restoran = rezultat.restoran;
      this.zauzetiStolovi = rezultat.zauzetiStolovi;
      this.slobodniStolovi = rezultat.slobodniStolovi;
      this.slobodniStolovi.forEach(sto=>{
        if(sto.brojMesta >= this.rezervacija.brojGostiju){
          this.odgovarajuciStolovi.push(sto);
        }
      })
      this.ctx  = this.canvas.nativeElement.getContext('2d');
      this.drawLayout(this.restoran, this.slobodniStolovi, this.zauzetiStolovi);
    } catch (error) {
      console.log(error)
    }
  }

  private drawLayout(restoran: restoran, slobodniStolovi: sto[], zauzetiStolovi: sto[]): void {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    const canvasWidth = this.canvas.nativeElement.width;
    const canvasHeight = this.canvas.nativeElement.height;
    const radius = 25;
    const kitchenWidth = 75;
    const kitchenHeight = 200;
    const toiletWidth = 75;
    const toiletHeight = 75;
    // Trazimo da li postoji element van kanvasa tako sto nadjemo minimum i maksimum X i Y koordinate
    let minX = Math.min( 
        ...slobodniStolovi.map(table => table.x),
        ...zauzetiStolovi.map(table => table.x),
        restoran.kitchen.x,
        restoran.toilets.x
    );
    let minY = Math.min(
        ...slobodniStolovi.map(table => table.y),
        ...zauzetiStolovi.map(table => table.y),
        restoran.kitchen.y,
        restoran.toilets.y
    );
    let maxX = Math.max(
        ...slobodniStolovi.map(table => table.x + radius * 2),
        ...zauzetiStolovi.map(table => table.x + radius * 2),
        restoran.kitchen.x + kitchenWidth,
        restoran.toilets.x + toiletWidth
    );
    let maxY = Math.max(
        ...slobodniStolovi.map(table => table.y + radius * 2),
        ...zauzetiStolovi.map(table => table.y + radius * 2),
        restoran.kitchen.y + kitchenHeight,
        restoran.toilets.y + toiletHeight
    );


    let shiftX = 0;
    let shiftY = 0;

    if (minX < 0) { // Ukoliko je minimum X van kanvasa, pomeramo ga za minX u desno
        shiftX = -minX;
    } else if (maxX > canvasWidth) { // ukoliko je maximum X van kanvasa, pomeramo ga za razdaljinu ivice kanvasa do maximum X u levo
        shiftX = canvasWidth - maxX;
    }

    if (minY < 0) { // ukoliko je minimum Y van kanvasa, pomeramo ga za minY na gore
        shiftY = -minY; 
    } else if (maxY > canvasHeight) { // ukoliko je maximum Y van kanvasa, pomeramo ga za razdaljinu ivice kanvasa do maximum Y na dole
        shiftY = canvasHeight - maxY;
    }

    const adjustPosition = (x: number, y: number) => { // funkcija za podesavanje koordinata
        return { x: x + shiftX, y: y + shiftY };
    };

    slobodniStolovi.forEach(table => {
        let { x, y } = adjustPosition(table.x, table.y); // ako je potrebno podesavanje, pomerimo sve
        const centerX = x + radius;
        const centerY = y + radius;

        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'white';
        this.ctx.fill();
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.fillStyle = 'black';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(`Table ${table.id}`, centerX, centerY);
    });

    zauzetiStolovi.forEach(table => {
        let { x, y } = adjustPosition(table.x, table.y); // ako je potrebno podesavanje, podesimo sve
        const centerX = x + radius;
        const centerY = y + radius;

        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'red';
        this.ctx.fill();
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.fillStyle = 'black';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(`Table ${table.id}`, centerX, centerY);
    });

    let kitchenPos = adjustPosition(restoran.kitchen.x, restoran.kitchen.y); // ako je potrebno podesavanje, podesimo kuhinju
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(kitchenPos.x, kitchenPos.y, kitchenWidth, kitchenHeight);
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(kitchenPos.x, kitchenPos.y, kitchenWidth, kitchenHeight);
    this.ctx.fillStyle = 'black';
    this.ctx.textAlign = 'start';
    this.ctx.textBaseline = 'top';
    this.ctx.fillText('Kuhinja', kitchenPos.x + 5, kitchenPos.y + 5);

    let toiletPos = adjustPosition(restoran.toilets.x, restoran.toilets.y); // ako je potrebno podesavanje, podesimo toalet
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(toiletPos.x, toiletPos.y, toiletWidth, toiletHeight);
    this.ctx.strokeStyle = 'black';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(toiletPos.x, toiletPos.y, toiletWidth, toiletHeight);
    this.ctx.fillStyle = 'black';
    this.ctx.textAlign = 'start';
    this.ctx.textBaseline = 'top';
    this.ctx.fillText('Toalet', toiletPos.x + 5, toiletPos.y + 5);
  }

  async potvrdiRezervaciju(){
    try{
      if(this.selectedStoId == -1) {
        this.message = "Niste odabrali sto!";
      } else {
        this.message = "";
        this.success = await lastValueFrom(this.rezervacijaService.potvrdiRezervaciju(this.rezervacija.id, this.selectedStoId, this.korisnik.username));
        if(this.success == "Uspesno ste potvrdili rezervaciju!"){
          const selectedSto = this.slobodniStolovi.find(sto => sto.id == this.selectedStoId);
          if(selectedSto){
            this.slobodniStolovi = this.slobodniStolovi.filter(sto => sto.id != this.selectedStoId);
            this.zauzetiStolovi.push(selectedSto);
          }
          this.flagCompleted = true;
          localStorage.removeItem('rezervacija');
          this.ctx  = this.canvas.nativeElement.getContext('2d');
          this.drawLayout(this.restoran, this.slobodniStolovi, this.zauzetiStolovi); 
        }
      }
    } catch (error){
      console.log(error);
    }
  }
}
