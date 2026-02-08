import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
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
    CommonModule, MatCardModule, MatTableModule,
    MatPaginatorModule, MatProgressBarModule
  ],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Student Report</mat-card-title>
      </mat-card-header>
      <mat-card-content>
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
  loading = false;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    this.api.getStudents(this.currentPage, this.pageSize)
      .subscribe({
        next: (res) => {
          this.students = res.content;
          this.totalElements = res.totalElements;
          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }
}
