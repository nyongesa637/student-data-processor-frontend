import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '../../services/api.service';

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
    MatSelectModule, MatButtonModule, MatProgressBarModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Student Report</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="filters">
          <mat-form-field appearance="outline">
            <mat-label>Search by Student ID</mat-label>
            <input matInput [(ngModel)]="searchId" (keyup.enter)="search()">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Filter by Class</mat-label>
            <mat-select [(ngModel)]="filterClass" (selectionChange)="search()">
              <mat-option value="">All Classes</mat-option>
              <mat-option *ngFor="let c of classes" [value]="c">{{ c }}</mat-option>
            </mat-select>
          </mat-form-field>
          <button mat-raised-button color="primary" (click)="search()">Search</button>
        </div>

        <div class="export-buttons">
          <button mat-stroked-button (click)="exportData('excel')">Export Excel</button>
          <button mat-stroked-button (click)="exportData('csv')">Export CSV</button>
          <button mat-stroked-button (click)="exportData('pdf')">Export PDF</button>
        </div>

        <mat-progress-bar *ngIf="loading" mode="indeterminate"></mat-progress-bar>

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

        <mat-paginator
          [length]="totalElements"
          [pageSize]="pageSize"
          [pageSizeOptions]="[10, 25, 50, 100]"
          (page)="onPageChange($event)"
          showFirstLastButtons>
        </mat-paginator>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    mat-card { margin: 20px auto; max-width: 1200px; }
    .filters { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; margin-bottom: 8px; }
    .export-buttons { display: flex; gap: 8px; margin-bottom: 16px; }
    .full-width { width: 100%; }
    table { width: 100%; }
  `]
})
export class ReportComponent implements OnInit {
  students: Student[] = [];
  displayedColumns = ['studentId', 'firstName', 'lastName', 'dob', 'studentClass', 'score'];
  totalElements = 0;
  pageSize = 25;
  currentPage = 0;
  searchId = '';
  filterClass = '';
  loading = false;
  classes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadData();
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
        error: () => { this.loading = false; }
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

    exportFn(this.searchId || undefined, this.filterClass || undefined).subscribe((blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `students.${ext}`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}
