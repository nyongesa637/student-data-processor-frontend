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
    <div class="gen-layout" [class.has-preview]="preview">
      <div class="gen-main">
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
            <button mat-raised-button class="action-btn" (click)="generate()" [disabled]="loading || !count">
              <mat-icon>play_arrow</mat-icon>
              {{ loading ? 'Generating...' : 'Generate Excel' }}
            </button>
          </mat-card-actions>
          <mat-progress-bar *ngIf="loading" mode="indeterminate"></mat-progress-bar>

          <mat-card-content *ngIf="message && !preview">
            <p [class]="success ? 'success' : 'error'">{{ message }}</p>
          </mat-card-content>
        </mat-card>

        <!-- Summary below the card -->
        <div class="file-summary" *ngIf="preview">
          <div class="summary-row"><span class="label">File</span><span class="value">{{ preview.filename }}</span></div>
          <div class="summary-row"><span class="label">Records</span><span class="value">{{ preview.count | number }}</span></div>
          <div class="summary-row"><span class="label">Format</span><span class="value">Excel (.xlsx)</span></div>
          <div class="summary-row"><span class="label">Status</span><span class="value status-success">Success</span></div>
        </div>

        <!-- Step Navigation -->
        <div class="step-nav">
          <span></span>
          <button mat-stroked-button routerLink="/process">
            Next: Process Excel <mat-icon>arrow_forward</mat-icon>
          </button>
        </div>
      </div>

      <!-- Preview panel on the right -->
      <div class="preview-side" *ngIf="preview">
        <div class="preview-editor">
          <div class="preview-toolbar">
            <div class="preview-tab">
              <mat-icon>description</mat-icon>
              <span>{{ preview.filename }}</span>
            </div>
          </div>
          <div class="preview-table-wrap">
            <table class="preview-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Student ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>DOB</th>
                  <th>Class</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of previewRows; let i = index">
                  <td class="row-num">{{ i + 1 }}</td>
                  <td>{{ row.studentId }}</td>
                  <td>{{ row.firstName }}</td>
                  <td>{{ row.lastName }}</td>
                  <td>{{ row.dob }}</td>
                  <td>{{ row.studentClass }}</td>
                  <td>{{ row.score }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="preview-footer">
            Showing {{ previewRows.length }} of {{ preview.count | number }} records
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .gen-layout {
      display: flex;
      gap: 24px;
      align-items: flex-start;

      &.has-preview {
        .gen-main { flex: 0 0 auto; min-width: 400px; max-width: 500px; }
        .preview-side { flex: 1; min-width: 0; }
      }
    }

    .gen-main {
      max-width: 600px;
    }

    .gen-card {
      box-shadow: none !important;
      border: 1px solid var(--border, #e5e7eb);
    }

    mat-card-title { display: flex; align-items: center; gap: 8px; }
    .full-width { width: 100%; }
    .success { color: green; margin-top: 16px; }
    .error { color: red; margin-top: 16px; }

    .action-btn {
      background: var(--primary, #0ea5e9) !important;
      color: white !important;
      box-shadow: none !important;
      border: 1px solid var(--primary, #0ea5e9) !important;
      display: inline-flex;
      align-items: center;
      gap: 4px;

      mat-icon { margin-right: 4px; }
    }

    .file-summary {
      margin-top: 16px;
      padding: 16px;
      background: var(--bg, #f8fafc);
      border: 1px solid var(--border, #e5e7eb);
      border-radius: 8px;
      display: flex;
      flex-direction: column;
      gap: 6px;

      .summary-row {
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
      margin-top: 16px;

      button {
        display: flex;
        align-items: center;
        gap: 4px;
        box-shadow: none !important;
      }
    }

    .preview-side {
      min-width: 0;
    }

    .preview-editor {
      border: 1px solid var(--border, #e5e7eb);
      border-radius: 8px;
      overflow: hidden;
      background: var(--surface, white);

      .preview-toolbar {
        display: flex;
        align-items: center;
        background: var(--bg, #f8fafc);
        border-bottom: 1px solid var(--border, #e5e7eb);
        padding: 0 12px;
        height: 36px;

        .preview-tab {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--text-secondary, #6b7280);
          font-weight: 500;

          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
            color: var(--primary, #0ea5e9);
          }
        }
      }

      .preview-table-wrap {
        overflow-x: auto;
      }

      .preview-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 12px;
        font-family: 'Roboto Mono', monospace;

        th, td {
          padding: 6px 10px;
          text-align: left;
          border-bottom: 1px solid var(--border, #e5e7eb);
          white-space: nowrap;
        }

        th {
          background: var(--bg, #f8fafc);
          color: var(--text-secondary, #6b7280);
          font-weight: 600;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          position: sticky;
          top: 0;
        }

        td {
          color: var(--text, #1f2937);
        }

        .row-num {
          color: var(--text-muted, #9ca3af);
          font-size: 11px;
          min-width: 24px;
        }

        tbody tr:hover {
          background: var(--primary-light, #e0f2fe);
        }
      }

      .preview-footer {
        padding: 8px 12px;
        font-size: 11px;
        color: var(--text-muted, #9ca3af);
        border-top: 1px solid var(--border, #e5e7eb);
        background: var(--bg, #f8fafc);
      }
    }

    @media (max-width: 900px) {
      .gen-layout {
        flex-direction: column;

        &.has-preview {
          .gen-main { max-width: 100%; min-width: 0; }
          .preview-side { width: 100%; }
        }
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
  previewRows: any[] = [];

  constructor(private api: ApiService, private toast: ToastService) {}

  generate() {
    this.loading = true;
    this.message = '';
    this.preview = null;
    this.previewRows = [];
    this.api.generateData(this.count).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = true;
        this.preview = { filename: res.filename, count: this.count };
        this.message = `Generated ${this.count} records. File: ${res.filename}`;
        this.toast.success(`Generated ${this.count} records successfully`);
        this.generatePreviewRows();
      },
      error: (err) => {
        this.loading = false;
        this.success = false;
        this.message = 'Error: ' + (err.error?.error || err.message);
        this.toast.error('Failed to generate data');
      }
    });
  }

  private generatePreviewRows() {
    const classes = ['Class A', 'Class B', 'Class C', 'Class D', 'Class E'];
    const firstNames = ['John', 'Jane', 'Alex', 'Maria', 'James', 'Sarah', 'David', 'Emma', 'Michael', 'Olivia', 'Daniel', 'Sophia', 'Robert', 'Emily', 'William'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris'];
    const limit = Math.min(this.count, 15);
    this.previewRows = [];
    for (let i = 0; i < limit; i++) {
      const year = 1998 + Math.floor(Math.random() * 8);
      const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
      const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
      this.previewRows.push({
        studentId: `STU${String(i + 1).padStart(6, '0')}`,
        firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
        lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
        dob: `${year}-${month}-${day}`,
        studentClass: classes[Math.floor(Math.random() * classes.length)],
        score: Math.floor(Math.random() * 101)
      });
    }
  }
}
