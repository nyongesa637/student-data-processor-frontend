import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-data-upload',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatProgressBarModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Upload CSV to Database (Score +5)</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <input type="file" accept=".csv" (change)="onFileSelected($event)" #fileInput>
        <p *ngIf="selectedFile">Selected: {{ selectedFile.name }}</p>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" (click)="upload()" [disabled]="loading || !selectedFile">
          {{ loading ? 'Uploading...' : 'Upload to Database' }}
        </button>
      </mat-card-actions>
      <mat-progress-bar *ngIf="loading" mode="indeterminate"></mat-progress-bar>
      <mat-card-content *ngIf="message">
        <p [class]="success ? 'success' : 'error'">{{ message }}</p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    mat-card { max-width: 600px; margin: 20px auto; }
    .success { color: green; margin-top: 16px; }
    .error { color: red; margin-top: 16px; }
    input[type="file"] { margin: 16px 0; }
  `]
})
export class DataUploadComponent {
  selectedFile: File | null = null;
  loading = false;
  message = '';
  success = false;

  constructor(private api: ApiService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  upload() {
    if (!this.selectedFile) return;
    this.loading = true;
    this.message = '';
    this.api.uploadFile(this.selectedFile).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = true;
        this.message = `Uploaded ${res.recordsInserted} records to database.`;
      },
      error: (err) => {
        this.loading = false;
        this.success = false;
        this.message = 'Error: ' + (err.error?.error || err.message);
      }
    });
  }
}
