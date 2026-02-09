import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-data-processing',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatProgressBarModule, MatIconModule],
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

      <!-- Preview Panel -->
      <div class="preview-panel" *ngIf="preview">
        <div class="preview-header">
          <mat-icon>check_circle</mat-icon>
          <span>Processing Complete</span>
        </div>
        <div class="preview-details">
          <div class="preview-row"><span class="label">Output File</span><span class="value">{{ preview.filename }}</span></div>
          <div class="preview-row"><span class="label">Format</span><span class="value">CSV (.csv)</span></div>
          <div class="preview-row"><span class="label">Transformation</span><span class="value">Score +10</span></div>
          <div class="preview-row"><span class="label">Status</span><span class="value status-success">Success</span></div>
        </div>
      </div>

      <mat-card-content *ngIf="message && !preview">
        <p [class]="success ? 'success' : 'error'">{{ message }}</p>
      </mat-card-content>
    </mat-card>

    <!-- Step Navigation -->
    <div class="step-nav">
      <button mat-stroked-button routerLink="/generate">
        <mat-icon>arrow_back</mat-icon> Generate Data
      </button>
      <button mat-stroked-button routerLink="/upload">
        Upload CSV <mat-icon>arrow_forward</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .proc-card { max-width: 600px; }
    mat-card-title { display: flex; align-items: center; gap: 8px; }
    .success { color: green; margin-top: 16px; }
    .error { color: red; margin-top: 16px; }
    input[type="file"] { margin: 16px 0; }
    button mat-icon { margin-right: 4px; }

    .preview-panel {
      margin: 16px;
      padding: 16px;
      background: var(--primary-light, #e0f2fe);
      border: 1px solid var(--primary, #0ea5e9);
      border-radius: 8px;

      .preview-header {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        color: var(--primary, #0ea5e9);
        margin-bottom: 12px;

        mat-icon { font-size: 20px; width: 20px; height: 20px; }
      }

      .preview-details {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .preview-row {
        display: flex;
        gap: 12px;
        font-size: 13px;

        .label {
          min-width: 100px;
          color: var(--text-secondary, #6b7280);
          font-weight: 500;
        }
        .value { color: var(--text, #1f2937); }
        .status-success { color: #16a34a; font-weight: 500; }
      }
    }

    .step-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 600px;
      margin-top: 16px;

      button {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
  `]
})
export class DataProcessingComponent {
  selectedFile: File | null = null;
  loading = false;
  message = '';
  success = false;
  preview: { filename: string } | null = null;

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
    this.preview = null;
    this.api.processFile(this.selectedFile).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = true;
        this.preview = { filename: res.filename };
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
