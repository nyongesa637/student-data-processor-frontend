import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-data-generation',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressBarModule, MatIconModule],
  template: `
    <mat-card class="gen-card">
      <mat-card-header>
        <mat-card-title>
          <mat-icon>dataset</mat-icon> Generate Student Data (Excel)
        </mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Number of Records</mat-label>
          <input matInput type="number" [(ngModel)]="count" min="1" max="1000000" placeholder="e.g. 1000000">
        </mat-form-field>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" (click)="generate()" [disabled]="loading || !count">
          <mat-icon>play_arrow</mat-icon>
          {{ loading ? 'Generating...' : 'Generate Excel' }}
        </button>
      </mat-card-actions>
      <mat-progress-bar *ngIf="loading" mode="indeterminate"></mat-progress-bar>

      <!-- Preview Panel -->
      <div class="preview-panel" *ngIf="preview">
        <div class="preview-header">
          <mat-icon>check_circle</mat-icon>
          <span>Generation Complete</span>
        </div>
        <div class="preview-details">
          <div class="preview-row"><span class="label">File</span><span class="value">{{ preview.filename }}</span></div>
          <div class="preview-row"><span class="label">Records</span><span class="value">{{ preview.count | number }}</span></div>
          <div class="preview-row"><span class="label">Format</span><span class="value">Excel (.xlsx)</span></div>
          <div class="preview-row"><span class="label">Status</span><span class="value status-success">Success</span></div>
        </div>
      </div>

      <mat-card-content *ngIf="message && !preview">
        <p [class]="success ? 'success' : 'error'">{{ message }}</p>
      </mat-card-content>
    </mat-card>

    <!-- Step Navigation -->
    <div class="step-nav">
      <span></span>
      <button mat-stroked-button routerLink="/process">
        Next: Process Excel <mat-icon>arrow_forward</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    .gen-card { max-width: 600px; }
    mat-card-title { display: flex; align-items: center; gap: 8px; }
    .full-width { width: 100%; }
    .success { color: green; margin-top: 16px; }
    .error { color: red; margin-top: 16px; }
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
          min-width: 80px;
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
export class DataGenerationComponent {
  count: number = 1000;
  loading = false;
  message = '';
  success = false;
  preview: { filename: string; count: number } | null = null;

  constructor(private api: ApiService, private toast: ToastService) {}

  generate() {
    this.loading = true;
    this.message = '';
    this.preview = null;
    this.api.generateData(this.count).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = true;
        this.preview = { filename: res.filename, count: this.count };
        this.message = `Generated ${this.count} records. File: ${res.filename}`;
        this.toast.success(`Generated ${this.count} records successfully`);
      },
      error: (err) => {
        this.loading = false;
        this.success = false;
        this.message = 'Error: ' + (err.error?.error || err.message);
        this.toast.error('Failed to generate data');
      }
    });
  }
}
