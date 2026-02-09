import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressBarModule, MatIconModule],
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
      <mat-card-content *ngIf="message">
        <p [class]="success ? 'success' : 'error'">{{ message }}</p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .gen-card { max-width: 600px; }
    mat-card-title { display: flex; align-items: center; gap: 8px; }
    .full-width { width: 100%; }
    .success { color: green; margin-top: 16px; }
    .error { color: red; margin-top: 16px; }
    button mat-icon { margin-right: 4px; }
  `]
})
export class DataGenerationComponent {
  count: number = 1000;
  loading = false;
  message = '';
  success = false;

  constructor(private api: ApiService, private toast: ToastService) {}

  generate() {
    this.loading = true;
    this.message = '';
    this.api.generateData(this.count).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = true;
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
