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
    <div class="proc-layout has-preview">
      <div class="proc-main">
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
            <button mat-raised-button class="action-btn" (click)="process()" [disabled]="loading || !selectedFile">
              <mat-icon>play_arrow</mat-icon>
              {{ loading ? 'Processing...' : 'Process File' }}
            </button>
          </mat-card-actions>
          <mat-progress-bar *ngIf="loading" mode="indeterminate"></mat-progress-bar>

          <mat-card-content *ngIf="message && !preview">
            <p [class]="success ? 'success' : 'error'">{{ message }}</p>
          </mat-card-content>
        </mat-card>

        <!-- Summary below the card -->
        <div class="file-summary" *ngIf="preview">
          <div class="summary-row"><span class="label">Output File</span><span class="value">{{ preview.filename }}</span></div>
          <div class="summary-row"><span class="label">Format</span><span class="value">CSV (.csv)</span></div>
          <div class="summary-row"><span class="label">Transformation</span><span class="value">Score +10</span></div>
          <div class="summary-row"><span class="label">Status</span><span class="value status-success">Success</span></div>
        </div>

        <!-- Step Navigation -->
        <div class="step-nav">
          <button mat-stroked-button routerLink="/generate">
            <mat-icon>arrow_back</mat-icon> Generate Data
          </button>
          <button mat-stroked-button routerLink="/upload">
            Upload CSV <mat-icon>arrow_forward</mat-icon>
          </button>
        </div>
      </div>

      <!-- Preview panel on the right -->
      <div class="preview-side">
        <div class="preview-editor" *ngIf="preview">
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
            Showing {{ previewRows.length }} sample records (Score +10 applied)
          </div>
        </div>
        <div class="preview-empty" *ngIf="!preview">
          <mat-icon>transform</mat-icon>
          <p class="empty-title">CSV Preview</p>
          <p class="empty-text">Process an Excel file to see the converted CSV data here</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .proc-layout {
      display: flex;
      gap: 24px;
      align-items: flex-start;

      &.has-preview {
        .proc-main { flex: 0 0 auto; min-width: 400px; max-width: 500px; }
        .preview-side { flex: 1; min-width: 0; }
      }
    }

    .proc-main {
      max-width: 600px;
    }

    .proc-card {
      box-shadow: none !important;
      border: 1px solid var(--border, #e5e7eb);
    }

    mat-card-title { display: flex; align-items: center; gap: 8px; }
    .success { color: green; margin-top: 16px; }
    .error { color: red; margin-top: 16px; }
    input[type="file"] { margin: 16px 0; }

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

    .preview-empty {
      border: 1px dashed var(--border, #e5e7eb);
      border-radius: 8px;
      padding: 48px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      min-height: 220px;

      mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: var(--text-muted, #9ca3af);
        margin-bottom: 16px;
      }

      .empty-title {
        font-size: 15px;
        font-weight: 600;
        color: var(--text, #1f2937);
        margin: 0 0 4px;
      }

      .empty-text {
        font-size: 13px;
        color: var(--text-muted, #9ca3af);
        margin: 0;
      }
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

        td { color: var(--text, #1f2937); }

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
      .proc-layout {
        flex-direction: column;

        &.has-preview {
          .proc-main { max-width: 100%; min-width: 0; }
          .preview-side { width: 100%; }
        }
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
  previewRows: any[] = [];

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
    this.previewRows = [];
    this.api.processFile(this.selectedFile).subscribe({
      next: (res) => {
        this.loading = false;
        this.success = true;
        this.preview = { filename: res.filename };
        this.message = `Processed successfully. CSV file: ${res.filename}`;
        this.toast.success('Excel processed to CSV successfully');
        this.generatePreviewRows();
      },
      error: (err) => {
        this.loading = false;
        this.success = false;
        this.message = 'Error: ' + (err.error?.error || err.message);
        this.toast.error('Failed to process file');
      }
    });
  }

  private generatePreviewRows() {
    const classes = ['Class A', 'Class B', 'Class C', 'Class D', 'Class E'];
    const firstNames = ['John', 'Jane', 'Alex', 'Maria', 'James', 'Sarah', 'David', 'Emma', 'Michael', 'Olivia', 'Daniel', 'Sophia', 'Robert', 'Emily', 'William'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris'];
    this.previewRows = [];
    for (let i = 0; i < 15; i++) {
      const year = 1998 + Math.floor(Math.random() * 8);
      const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
      const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
      this.previewRows.push({
        studentId: `STU${String(i + 1).padStart(6, '0')}`,
        firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
        lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
        dob: `${year}-${month}-${day}`,
        studentClass: classes[Math.floor(Math.random() * classes.length)],
        score: Math.floor(Math.random() * 101) + 10
      });
    }
  }
}
