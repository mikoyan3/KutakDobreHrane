import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LayoutResponse } from '../models/LayoutResponse';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  selectedFile: File = null;
  layoutData: LayoutResponse;

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadLayout(): void {
    const formData = new FormData();
    formData.append('layout', this.selectedFile, this.selectedFile.name);

    this.http.post('http://localhost:4000/restoran/upload-layout', formData)
      .subscribe({
        next: (response: any) => {
          console.log('Upload response:', response);
          this.fetchLayout(); 
        },
        error: (error: any) => {
          console.error('Error uploading layout:', error);
          
        }
      });
  }

  private fetchLayout(): void {
    this.http.get<LayoutResponse>('http://localhost:4000/restoran/layout')
      .subscribe({
        next: (data: LayoutResponse) => {
          this.layoutData = data; 
        },
        error: (error: any) => {
          console.error('Error fetching layout:', error);
          
        }
      });
  }
}
