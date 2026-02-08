import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-data-generation',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressBarModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Generate Student Data (Excel)</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Number of Records</mat-label>
          <input matInput type="number" [(ngModel)]="count" min="1" max="1000000" placeholder="e.g. 1000000">
        </mat-form-field>
      </mat-card-content>
      <mat-card-actions>
        <button mat-raised-button color="primary" (click)="generate()" [disabled]="loading || !count">
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
    mat-card { max-width: 600px; margin: 20px auto; }
    .full-width { width: 100%; }
    .success { color: green; margin-top: 16px; }
    .error { color: red; margin-top: 16px; }
  `]
})
export class DataGenerationComponent {
  count: number = 1000;
  loading = false;
  message = '';
  success = false;

  constructor(private api: ApiService) {}

  generate() {
    this.loading = true;
    this.message = '';
    this.api.generateData(this.count).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = true;
        this.message = `Generated ${this.count} records. File: ${res.filename}`;
      },
      error: (err) => {
        this.loading = false;
        this.success = false;
        this.message = 'Error: ' + (err.error?.error || err.message);
      }
    });
  }
}
