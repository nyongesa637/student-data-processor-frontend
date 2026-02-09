import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-data-processing',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatProgressBarModule, MatIconModule],
  template: `
    <mat-card class="proc-card">
      <mat-card-header>
        <mat-card-title>
          <mat-icon>transform</mat-icon> Process Excel to CSV (Score +10)
        </mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <input type="file" accept=".xlsx,.xls" (change)="onFileSelected($event)" #fileInput>
        <p *ngIf="selectedFile">Selected: {{ selectedFile.name }}</p>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" (click)="process()" [disabled]="loading || !selectedFile">
          <mat-icon>play_arrow</mat-icon>
          {{ loading ? 'Processing...' : 'Process File' }}
        </button>
      </mat-card-actions>
      <mat-progress-bar *ngIf="loading" mode="indeterminate"></mat-progress-bar>
      <mat-card-content *ngIf="message">
        <p [class]="success ? 'success' : 'error'">{{ message }}</p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .proc-card { max-width: 600px; }
    mat-card-title { display: flex; align-items: center; gap: 8px; }
    .success { color: green; margin-top: 16px; }
    .error { color: red; margin-top: 16px; }
    input[type="file"] { margin: 16px 0; }
    button mat-icon { margin-right: 4px; }
  `]
})
export class DataProcessingComponent {
  selectedFile: File | null = null;
  loading = false;
  message = '';
  success = false;

  constructor(private api: ApiService, private toast: ToastService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  process() {
    if (!this.selectedFile) return;
    this.loading = true;
    this.message = '';
    this.api.processFile(this.selectedFile).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = true;
        this.message = `Processed successfully. CSV file: ${res.filename}`;
        this.toast.success('Excel processed to CSV successfully');
      },
      error: (err) => {
        this.loading = false;
        this.success = false;
        this.message = 'Error: ' + (err.error?.error || err.message);
        this.toast.error('Failed to process file');
      }
    });
  }
}
