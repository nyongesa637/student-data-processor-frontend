import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

interface Student {
  id: number;
  studentId: string;
  firstName: string;
  lastName: string;
  dob: string;
  studentClass: string;
  score: number;
}

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatTableModule,
    MatPaginatorModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatProgressBarModule, MatIconModule
  ],
  template: `
    <div class="report-container">
      <mat-card class="report-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>assessment</mat-icon> Student Report
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <!-- Desktop filters -->
          <div class="filters" *ngIf="!isMobile">
            <mat-form-field appearance="outline" subscriptSizing="dynamic">
              <mat-label>Search by Student ID</mat-label>
              <input matInput [(ngModel)]="searchId" (keyup.enter)="search()">
            </mat-form-field>
            <mat-form-field appearance="outline" subscriptSizing="dynamic">
              <mat-label>Filter by Class</mat-label>
              <mat-select [(ngModel)]="filterClass" (selectionChange)="search()">
                <mat-option value="">All Classes</mat-option>
                <mat-option *ngFor="let c of classes; trackBy: trackByClass" [value]="c">{{ c }}</mat-option>
              </mat-select>
            </mat-form-field>
            <button mat-raised-button color="primary" (click)="search()">
              <mat-icon>search</mat-icon> Search
            </button>
          </div>

          <!-- Desktop export buttons -->
          <div class="export-buttons" *ngIf="!isMobile">
            <button mat-stroked-button (click)="exportData('excel')">
              <mat-icon>table_chart</mat-icon> Export Excel
            </button>
            <button mat-stroked-button (click)="exportData('csv')">
              <mat-icon>description</mat-icon> Export CSV
            </button>
            <button mat-stroked-button (click)="exportData('pdf')">
              <mat-icon>picture_as_pdf</mat-icon> Export PDF
            </button>
          </div>

          <mat-progress-bar *ngIf="loading" mode="indeterminate"></mat-progress-bar>

          <div class="table-container">
            <table mat-table [dataSource]="students" class="full-width">
              <ng-container matColumnDef="studentId">
                <th mat-header-cell *matHeaderCellDef>Student ID</th>
                <td mat-cell *matCellDef="let s">{{ s.studentId }}</td>
              </ng-container>
              <ng-container matColumnDef="firstName">
                <th mat-header-cell *matHeaderCellDef>First Name</th>
                <td mat-cell *matCellDef="let s">{{ s.firstName }}</td>
              </ng-container>
              <ng-container matColumnDef="lastName">
                <th mat-header-cell *matHeaderCellDef>Last Name</th>
                <td mat-cell *matCellDef="let s">{{ s.lastName }}</td>
              </ng-container>
              <ng-container matColumnDef="dob">
                <th mat-header-cell *matHeaderCellDef>Date of Birth</th>
                <td mat-cell *matCellDef="let s">{{ s.dob }}</td>
              </ng-container>
              <ng-container matColumnDef="studentClass">
                <th mat-header-cell *matHeaderCellDef>Class</th>
                <td mat-cell *matCellDef="let s">{{ s.studentClass }}</td>
              </ng-container>
              <ng-container matColumnDef="score">
                <th mat-header-cell *matHeaderCellDef>Score</th>
                <td mat-cell *matCellDef="let s">{{ s.score }}</td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
            </table>
          </div>

          <mat-paginator
            [length]="totalElements"
            [pageSize]="pageSize"
            [pageSizeOptions]="[10, 25, 50, 100]"
            (page)="onPageChange($event)"
            showFirstLastButtons>
          </mat-paginator>
        </mat-card-content>
      </mat-card>

      <!-- Mobile floating action bar -->
      <div class="mobile-fab" *ngIf="isMobile">
        <button class="fab-section" (click)="showFilterDrawer = true">
          <mat-icon>filter_list</mat-icon>
          <span>Filter</span>
        </button>
        <div class="fab-divider"></div>
        <button class="fab-section" (click)="showExportDrawer = true">
          <mat-icon>download</mat-icon>
          <span>Export</span>
        </button>
      </div>

      <!-- Mobile filter bottom drawer -->
      <div class="drawer-backdrop" *ngIf="showFilterDrawer" (click)="showFilterDrawer = false"></div>
      <div class="bottom-drawer" [class.open]="showFilterDrawer">
        <div class="drawer-handle" (click)="showFilterDrawer = false"></div>
        <div class="drawer-header">
          <h3>Filter Students</h3>
          <button mat-icon-button (click)="showFilterDrawer = false">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        <div class="drawer-body">
          <mat-form-field appearance="outline" subscriptSizing="dynamic" class="full-width">
            <mat-label>Search by Student ID</mat-label>
            <input matInput [(ngModel)]="searchId">
          </mat-form-field>
          <mat-form-field appearance="outline" subscriptSizing="dynamic" class="full-width">
            <mat-label>Filter by Class</mat-label>
            <mat-select [(ngModel)]="filterClass">
              <mat-option value="">All Classes</mat-option>
              <mat-option *ngFor="let c of classes; trackBy: trackByClass" [value]="c">{{ c }}</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-raised-button color="primary" class="full-width" (click)="search(); showFilterDrawer = false">
            <mat-icon>search</mat-icon> Apply Filter
          </button>
        </div>
      </div>

      <!-- Mobile export bottom drawer -->
      <div class="drawer-backdrop" *ngIf="showExportDrawer" (click)="showExportDrawer = false"></div>
      <div class="bottom-drawer" [class.open]="showExportDrawer">
        <div class="drawer-handle" (click)="showExportDrawer = false"></div>
        <div class="drawer-header">
          <h3>Export Data</h3>
          <button mat-icon-button (click)="showExportDrawer = false">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        <div class="drawer-body export-options">
          <button mat-stroked-button class="export-option" (click)="exportData('excel'); showExportDrawer = false">
            <mat-icon>table_chart</mat-icon>
            <div class="export-label">
              <span class="export-title">Excel</span>
              <span class="export-desc">Download as .xlsx</span>
            </div>
          </button>
          <button mat-stroked-button class="export-option" (click)="exportData('csv'); showExportDrawer = false">
            <mat-icon>description</mat-icon>
            <div class="export-label">
              <span class="export-title">CSV</span>
              <span class="export-desc">Download as .csv</span>
            </div>
          </button>
          <button mat-stroked-button class="export-option" (click)="exportData('pdf'); showExportDrawer = false">
            <mat-icon>picture_as_pdf</mat-icon>
            <div class="export-label">
              <span class="export-title">PDF</span>
              <span class="export-desc">Download as .pdf</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .report-container { position: relative; }
    .report-card { max-width: 1200px; margin: 0 auto; }
    mat-card-title { display: flex; align-items: center; gap: 8px; }
    .filters { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-bottom: 8px; }
    .filters mat-form-field { font-size: 13px; }
    .export-buttons { display: flex; gap: 8px; margin-bottom: 16px; }
    .export-buttons button mat-icon { margin-right: 4px; font-size: 18px; width: 18px; height: 18px; }
    .full-width { width: 100%; }
    .table-container { overflow-x: auto; margin: 0 -16px; padding: 0 16px; }
    table { width: 100%; min-width: 600px; }

    /* Mobile floating action bar */
    .mobile-fab {
      position: fixed;
      bottom: 68px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      background: var(--primary, #0ea5e9);
      border-radius: 28px;
      box-shadow: 0 4px 16px rgba(14, 165, 233, 0.35);
      z-index: 100;
      overflow: hidden;

      .fab-section {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 12px 22px;
        background: none;
        border: none;
        color: white;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        font-family: inherit;

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }

      .fab-divider {
        width: 1px;
        height: 24px;
        background: rgba(255, 255, 255, 0.3);
        flex-shrink: 0;
      }
    }

    /* Bottom drawer */
    .drawer-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.4);
      z-index: 200;
    }

    .bottom-drawer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: var(--surface, white);
      border-radius: 16px 16px 0 0;
      z-index: 201;
      transform: translateY(100%);
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      max-height: 70vh;
      overflow-y: auto;
      box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.12);

      &.open {
        transform: translateY(0);
      }

      .drawer-handle {
        width: 40px;
        height: 4px;
        background: var(--border, #e5e7eb);
        border-radius: 2px;
        margin: 10px auto 4px;
        cursor: pointer;
      }

      .drawer-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 4px 16px 12px;
        border-bottom: 1px solid var(--border, #e5e7eb);

        h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--text, #1f2937);
        }
      }

      .drawer-body {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .export-options {
        gap: 8px;
      }

      .export-option {
        display: flex !important;
        align-items: center;
        gap: 12px;
        padding: 14px 16px !important;
        height: auto !important;
        text-align: left;
        border: 1px solid var(--border, #e5e7eb) !important;
        border-radius: 10px !important;

        mat-icon {
          color: var(--primary, #0ea5e9);
          font-size: 22px;
          width: 22px;
          height: 22px;
          flex-shrink: 0;
        }

        .export-label {
          display: flex;
          flex-direction: column;
          gap: 2px;

          .export-title {
            font-size: 14px;
            font-weight: 500;
            color: var(--text, #1f2937);
          }

          .export-desc {
            font-size: 12px;
            color: var(--text-secondary, #6b7280);
          }
        }
      }
    }

    @media (max-width: 768px) {
      .report-card {
        box-shadow: none !important;
        border-radius: 0;
        margin: -16px;
        padding-bottom: 80px;
      }

      .table-container {
        margin: 0 -16px;
        padding: 0;
      }
    }
  `]
})
export class ReportComponent implements OnInit, OnDestroy {
  students: Student[] = [];
  displayedColumns = ['studentId', 'firstName', 'lastName', 'dob', 'studentClass', 'score'];
  totalElements = 0;
  pageSize = 25;
  currentPage = 0;
  searchId = '';
  filterClass = '';
  loading = false;
  classes: string[] = [];

  isMobile = false;
  showFilterDrawer = false;
  showExportDrawer = false;

  private subs: Subscription[] = [];

  constructor(
    private api: ApiService,
    private toast: ToastService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    this.subs.push(
      this.breakpointObserver.observe(['(max-width: 768px)']).subscribe(result => {
        this.isMobile = result.matches;
        if (!this.isMobile) {
          this.showFilterDrawer = false;
          this.showExportDrawer = false;
        }
      })
    );

    this.api.getClasses().subscribe({
      next: (classes) => this.classes = classes,
      error: () => {}
    });
    this.loadData();
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  loadData() {
    this.loading = true;
    this.api.getStudents(this.currentPage, this.pageSize, this.searchId || undefined, this.filterClass || undefined)
      .subscribe({
        next: (res) => {
          this.students = res.content;
          this.totalElements = res.totalElements;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.toast.error('Failed to load student data');
        }
      });
  }

  search() {
    this.currentPage = 0;
    this.loadData();
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }

  exportData(format: string) {
    const exportFn = format === 'excel' ? this.api.exportExcel.bind(this.api) :
                     format === 'csv' ? this.api.exportCsv.bind(this.api) :
                     this.api.exportPdf.bind(this.api);
    const ext = format === 'excel' ? 'xlsx' : format;

    exportFn(this.searchId || undefined, this.filterClass || undefined).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `students.${ext}`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.toast.success(`Exported as ${format.toUpperCase()} successfully`);
      },
      error: () => {
        this.toast.error(`Failed to export ${format.toUpperCase()}`);
      }
    });
  }

  trackByClass(index: number, item: string) {
    return item;
  }
}
