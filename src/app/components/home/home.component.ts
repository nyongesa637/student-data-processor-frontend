import { Component, OnInit, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-feature-request-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2>Request a Feature</h2>
        <p>Have an idea to improve the app? Let us know!</p>
      </div>
      <div class="dialog-body">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Title</mat-label>
          <input matInput [(ngModel)]="title" placeholder="Brief title for your feature">
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput [(ngModel)]="description" rows="4" placeholder="Describe the feature in detail"></textarea>
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput [(ngModel)]="email" type="email" placeholder="your@email.com">
        </mat-form-field>
      </div>
      <div class="dialog-actions">
        <button mat-button (click)="close()">Cancel</button>
        <button mat-raised-button color="primary" (click)="submit()" [disabled]="!title || !description || !email || submitting">
          {{ submitting ? 'Submitting...' : 'Submit' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container { padding: 24px; min-width: 400px; }
    .dialog-header h2 { margin: 0 0 4px; }
    .dialog-header p { color: #666; margin: 0 0 20px; }
    .dialog-body { display: flex; flex-direction: column; gap: 4px; }
    .full-width { width: 100%; }
    .dialog-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; }
  `]
})
export class FeatureRequestDialogComponent {
  title = '';
  description = '';
  email = '';
  submitting = false;

  constructor(
    private api: ApiService,
    private toast: ToastService,
    private dialog: MatDialog
  ) {}

  submit() {
    this.submitting = true;
    this.api.submitFeatureRequest({ title: this.title, description: this.description, email: this.email })
      .subscribe({
        next: () => {
          this.toast.success('Feature request submitted!');
          this.submitting = false;
          this.dialog.closeAll();
        },
        error: () => {
          this.toast.error('Failed to submit feature request');
          this.submitting = false;
        }
      });
  }

  close() {
    this.dialog.closeAll();
  }
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatCardModule, MatButtonModule,
    MatIconModule, MatTableModule, MatProgressBarModule
  ],
  template: `
    <div class="dashboard">
      <!-- Action Cards -->
      <div class="action-cards">
        <div class="action-card get-started" #meshCard (mousemove)="onMouseMove($event, 0)" (mouseleave)="onMouseLeave(0)">
          <div class="card-content">
            <mat-icon class="card-icon">rocket_launch</mat-icon>
            <h2>Get Started</h2>
            <p>Generate student data to begin your data processing workflow</p>
            <button mat-raised-button routerLink="/generate" class="card-btn">
              <mat-icon>arrow_forward</mat-icon> Generate Data
            </button>
          </div>
        </div>
        <div class="action-card request-feature" #meshCard (mousemove)="onMouseMove($event, 1)" (mouseleave)="onMouseLeave(1)">
          <div class="card-content">
            <mat-icon class="card-icon">lightbulb</mat-icon>
            <h2>Request Feature</h2>
            <p>Have an idea? Submit a feature request and help shape the app</p>
            <button mat-raised-button (click)="openFeatureDialog()" class="card-btn">
              <mat-icon>add</mat-icon> Request Feature
            </button>
          </div>
        </div>
      </div>

      <!-- Steps Timeline -->
      <div class="timeline-section">
        <h3 class="section-title">
          <mat-icon>timeline</mat-icon> Workflow Steps
        </h3>
        <div class="timeline">
          <div class="timeline-step" *ngFor="let step of steps; let i = index; let last = last">
            <a [routerLink]="step.route" class="step-circle" [style.background]="step.color">
              <mat-icon>{{ step.icon }}</mat-icon>
            </a>
            <div class="step-info">
              <span class="step-label">Step {{ i + 1 }}</span>
              <span class="step-name">{{ step.name }}</span>
              <span class="step-desc">{{ step.description }}</span>
            </div>
            <div class="timeline-connector" *ngIf="!last"></div>
          </div>
        </div>
      </div>

      <!-- Analytics -->
      <div class="analytics-section">
        <h3 class="section-title">
          <mat-icon>analytics</mat-icon> Analytics Summary
        </h3>
        <mat-progress-bar *ngIf="loadingAnalytics" mode="indeterminate"></mat-progress-bar>
        <div class="analytics-grid" *ngIf="!loadingAnalytics">
          <div class="stat-card">
            <mat-icon>people</mat-icon>
            <div class="stat-info">
              <span class="stat-value">{{ analytics?.totalStudents | number }}</span>
              <span class="stat-label">Total Students</span>
            </div>
          </div>
          <div class="stat-card">
            <mat-icon>trending_up</mat-icon>
            <div class="stat-info">
              <span class="stat-value">{{ analytics?.averageScore }}</span>
              <span class="stat-label">Average Score</span>
            </div>
          </div>
          <div class="stat-card">
            <mat-icon>arrow_upward</mat-icon>
            <div class="stat-info">
              <span class="stat-value">{{ analytics?.highestScore }}</span>
              <span class="stat-label">Highest Score</span>
            </div>
          </div>
          <div class="stat-card">
            <mat-icon>arrow_downward</mat-icon>
            <div class="stat-info">
              <span class="stat-value">{{ analytics?.lowestScore }}</span>
              <span class="stat-label">Lowest Score</span>
            </div>
          </div>
        </div>

        <div class="class-distribution" *ngIf="analytics?.classDistribution">
          <h4>Top Classes by Student Count</h4>
          <div class="distribution-bars">
            <div class="dist-row" *ngFor="let entry of classDistEntries">
              <span class="dist-label">{{ entry[0] }}</span>
              <div class="dist-bar-container">
                <div class="dist-bar" [style.width.%]="getBarWidth(entry[1])"></div>
              </div>
              <span class="dist-count">{{ entry[1] }}</span>
            </div>
          </div>
        </div>

        <div class="recent-section" *ngIf="analytics?.recentRecords?.length > 0">
          <h4>Recent Records</h4>
          <table mat-table [dataSource]="analytics.recentRecords" class="recent-table">
            <ng-container matColumnDef="studentId">
              <th mat-header-cell *matHeaderCellDef>Student ID</th>
              <td mat-cell *matCellDef="let s">{{ s.studentId }}</td>
            </ng-container>
            <ng-container matColumnDef="firstName">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let s">{{ s.firstName }} {{ s.lastName }}</td>
            </ng-container>
            <ng-container matColumnDef="studentClass">
              <th mat-header-cell *matHeaderCellDef>Class</th>
              <td mat-cell *matCellDef="let s">{{ s.studentClass }}</td>
            </ng-container>
            <ng-container matColumnDef="score">
              <th mat-header-cell *matHeaderCellDef>Score</th>
              <td mat-cell *matCellDef="let s">{{ s.score }}</td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="['studentId', 'firstName', 'studentClass', 'score']"></tr>
            <tr mat-row *matRowDef="let row; columns: ['studentId', 'firstName', 'studentClass', 'score']"></tr>
          </table>
          <a routerLink="/report" class="view-more">View all in Report →</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      max-width: 1100px;
      margin: 0 auto;
    }

    .action-cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 32px;
    }

    .action-card {
      border-radius: 16px;
      padding: 32px;
      position: relative;
      overflow: hidden;
      cursor: default;
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
      }

      &.get-started {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      &.request-feature {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }

      .card-content {
        position: relative;
        z-index: 1;
        color: white;

        .card-icon {
          font-size: 40px;
          width: 40px;
          height: 40px;
          margin-bottom: 12px;
          opacity: 0.9;
        }

        h2 {
          margin: 0 0 8px;
          font-size: 22px;
          font-weight: 600;
        }

        p {
          margin: 0 0 20px;
          opacity: 0.85;
          font-size: 14px;
          line-height: 1.5;
        }

        .card-btn {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(4px);

          mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
            margin-right: 4px;
          }
        }
      }
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin-bottom: 20px;

      mat-icon { color: #7c4dff; }
    }

    .timeline-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 32px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    }

    .timeline {
      display: flex;
      align-items: flex-start;
      gap: 0;
      overflow-x: auto;
    }

    .timeline-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      flex: 1;
      min-width: 160px;

      .step-circle {
        width: 52px;
        height: 52px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        text-decoration: none;
        z-index: 1;
        transition: transform 0.2s;

        &:hover { transform: scale(1.1); }

        mat-icon { font-size: 24px; }
      }

      .step-info {
        text-align: center;
        margin-top: 12px;
        display: flex;
        flex-direction: column;
        gap: 2px;

        .step-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #999;
        }

        .step-name {
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        .step-desc {
          font-size: 12px;
          color: #777;
        }
      }

      .timeline-connector {
        position: absolute;
        top: 26px;
        left: calc(50% + 30px);
        width: calc(100% - 60px);
        height: 2px;
        background: linear-gradient(to right, #7c4dff, #b388ff);
      }
    }

    .analytics-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    }

    .analytics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 10px;
      border-left: 3px solid #7c4dff;

      mat-icon {
        color: #7c4dff;
        font-size: 28px;
        width: 28px;
        height: 28px;
      }

      .stat-info {
        display: flex;
        flex-direction: column;

        .stat-value {
          font-size: 22px;
          font-weight: 700;
          color: #333;
        }

        .stat-label {
          font-size: 12px;
          color: #777;
        }
      }
    }

    .class-distribution {
      margin-bottom: 24px;

      h4 { font-size: 15px; color: #555; margin-bottom: 12px; }

      .distribution-bars {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .dist-row {
        display: flex;
        align-items: center;
        gap: 12px;

        .dist-label {
          min-width: 70px;
          font-size: 13px;
          color: #555;
          text-align: right;
        }

        .dist-bar-container {
          flex: 1;
          height: 20px;
          background: #f0f0f0;
          border-radius: 10px;
          overflow: hidden;
        }

        .dist-bar {
          height: 100%;
          background: linear-gradient(to right, #7c4dff, #b388ff);
          border-radius: 10px;
          transition: width 0.5s ease;
        }

        .dist-count {
          min-width: 50px;
          font-size: 13px;
          font-weight: 600;
          color: #333;
        }
      }
    }

    .recent-section {
      h4 { font-size: 15px; color: #555; margin-bottom: 12px; }

      .recent-table {
        width: 100%;
        margin-bottom: 8px;
      }

      .view-more {
        display: inline-block;
        margin-top: 8px;
        color: #7c4dff;
        text-decoration: none;
        font-size: 13px;
        font-weight: 500;

        &:hover { text-decoration: underline; }
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  analytics: any = null;
  loadingAnalytics = true;
  classDistEntries: [string, number][] = [];
  maxClassCount = 0;

  @ViewChildren('meshCard') meshCards!: QueryList<ElementRef>;

  steps = [
    { name: 'Generate Data', description: 'Create Excel file', icon: 'dataset', route: '/generate', color: '#667eea' },
    { name: 'Process Excel', description: 'Convert to CSV (+10)', icon: 'transform', route: '/process', color: '#764ba2' },
    { name: 'Upload CSV', description: 'Store in database (+5)', icon: 'cloud_upload', route: '/upload', color: '#f093fb' },
    { name: 'View Reports', description: 'Analyze & export', icon: 'assessment', route: '/report', color: '#f5576c' }
  ];

  constructor(
    private api: ApiService,
    private toast: ToastService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.api.getAnalyticsSummary().subscribe({
      next: (data) => {
        this.analytics = data;
        this.loadingAnalytics = false;
        if (data.classDistribution) {
          this.classDistEntries = Object.entries(data.classDistribution) as [string, number][];
          this.maxClassCount = Math.max(...this.classDistEntries.map(e => e[1] as number), 1);
        }
      },
      error: () => {
        this.loadingAnalytics = false;
      }
    });
  }

  getBarWidth(count: number): number {
    return (count / this.maxClassCount) * 100;
  }

  onMouseMove(event: MouseEvent, index: number) {
    const cards = this.meshCards?.toArray();
    if (!cards || !cards[index]) return;
    const el = cards[index].nativeElement as HTMLElement;
    const rect = el.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    el.style.background = index === 0
      ? `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2), transparent 60%), linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
      : `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2), transparent 60%), linear-gradient(135deg, #f093fb 0%, #f5576c 100%)`;
  }

  onMouseLeave(index: number) {
    const cards = this.meshCards?.toArray();
    if (!cards || !cards[index]) return;
    const el = cards[index].nativeElement as HTMLElement;
    el.style.background = index === 0
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
  }

  openFeatureDialog() {
    this.dialog.open(FeatureRequestDialogComponent, { width: '500px' });
  }
}
