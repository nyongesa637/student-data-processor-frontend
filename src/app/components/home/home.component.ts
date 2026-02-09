import { Component, OnInit, OnDestroy, ElementRef, ViewChild, NgZone, AfterViewInit } from '@angular/core';
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

interface MeshNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
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
      <!-- Action Cards with Mesh Background -->
      <div class="mesh-container" (mousemove)="onMeshMouseMove($event)" (mouseleave)="onMeshMouseLeave()">
        <canvas #meshCanvas class="mesh-canvas"></canvas>
        <div class="action-cards">
          <div class="action-card get-started">
            <div class="card-content">
              <mat-icon class="card-icon">rocket_launch</mat-icon>
              <h2>Get Started</h2>
              <p>Generate student data to begin your data processing workflow</p>
              <button mat-raised-button routerLink="/generate" class="card-btn">
                <mat-icon>arrow_forward</mat-icon> Generate Data
              </button>
            </div>
          </div>
          <div class="action-card request-feature">
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
      </div>

      <!-- Steps Timeline -->
      <div class="timeline-section">
        <h3 class="section-title">
          <mat-icon>timeline</mat-icon> Workflow Steps
        </h3>
        <div class="timeline">
          <div class="timeline-step" *ngFor="let step of steps; let i = index; let last = last">
            <a [routerLink]="step.route" class="step-circle">
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

    .mesh-container {
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 32px;
      background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%);
    }

    .mesh-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .action-cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      padding: 32px;
      position: relative;
      z-index: 1;
    }

    .action-card {
      border-radius: 12px;
      padding: 32px;
      position: relative;
      overflow: hidden;
      cursor: default;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: transform 0.2s ease, background 0.2s ease;

      &:hover {
        transform: translateY(-2px);
        background: rgba(255, 255, 255, 0.15);
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
      color: var(--text, #1f2937);
      margin-bottom: 20px;

      mat-icon { color: var(--primary, #0ea5e9); }
    }

    .timeline-section {
      background: var(--surface, white);
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 32px;
      border: 1px solid var(--border, #e5e7eb);
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
        background: var(--primary-light, #e0f2fe);
        color: var(--primary, #0ea5e9);
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
          color: var(--text-muted, #9ca3af);
        }

        .step-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text, #1f2937);
        }

        .step-desc {
          font-size: 12px;
          color: var(--text-secondary, #6b7280);
        }
      }

      .timeline-connector {
        position: absolute;
        top: 26px;
        left: calc(50% + 30px);
        width: calc(100% - 60px);
        height: 2px;
        background: linear-gradient(to right, var(--primary, #0ea5e9), rgba(14, 165, 233, 0.4));
      }
    }

    .analytics-section {
      background: var(--surface, white);
      border-radius: 12px;
      padding: 24px;
      border: 1px solid var(--border, #e5e7eb);
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
      background: var(--bg, #f8fafc);
      border-radius: 10px;
      border: 1px solid var(--border, #e5e7eb);

      mat-icon {
        color: var(--primary, #0ea5e9);
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
          color: var(--text, #1f2937);
        }

        .stat-label {
          font-size: 12px;
          color: var(--text-secondary, #6b7280);
        }
      }
    }

    .class-distribution {
      margin-bottom: 24px;

      h4 { font-size: 15px; color: var(--text-secondary, #6b7280); margin-bottom: 12px; }

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
          color: var(--text-secondary, #6b7280);
          text-align: right;
        }

        .dist-bar-container {
          flex: 1;
          height: 20px;
          background: var(--bg, #f8fafc);
          border-radius: 10px;
          overflow: hidden;
        }

        .dist-bar {
          height: 100%;
          background: linear-gradient(to right, var(--primary, #0ea5e9), rgba(14, 165, 233, 0.5));
          border-radius: 10px;
          transition: width 0.5s ease;
        }

        .dist-count {
          min-width: 50px;
          font-size: 13px;
          font-weight: 600;
          color: var(--text, #1f2937);
        }
      }
    }

    .recent-section {
      h4 { font-size: 15px; color: var(--text-secondary, #6b7280); margin-bottom: 12px; }

      .recent-table {
        width: 100%;
        margin-bottom: 8px;
      }

      .view-more {
        display: inline-block;
        margin-top: 8px;
        color: var(--primary, #0ea5e9);
        text-decoration: none;
        font-size: 13px;
        font-weight: 500;

        &:hover { text-decoration: underline; }
      }
    }

    @media (max-width: 768px) {
      .action-cards {
        grid-template-columns: 1fr;
      }
      .analytics-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  analytics: any = null;
  loadingAnalytics = true;
  classDistEntries: [string, number][] = [];
  maxClassCount = 0;

  @ViewChild('meshCanvas') meshCanvasRef!: ElementRef<HTMLCanvasElement>;

  private meshNodes: MeshNode[] = [];
  private animFrameId = 0;
  private mouseX = -1000;
  private mouseY = -1000;

  steps = [
    { name: 'Generate Data', description: 'Create Excel file', icon: 'dataset', route: '/generate' },
    { name: 'Process Excel', description: 'Convert to CSV (+10)', icon: 'transform', route: '/process' },
    { name: 'Upload CSV', description: 'Store in database (+5)', icon: 'cloud_upload', route: '/upload' },
    { name: 'View Reports', description: 'Analyze & export', icon: 'assessment', route: '/report' }
  ];

  constructor(
    private api: ApiService,
    private toast: ToastService,
    private dialog: MatDialog,
    private router: Router,
    private ngZone: NgZone
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

  ngAfterViewInit() {
    this.initMesh();
  }

  ngOnDestroy() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
    }
  }

  private initMesh() {
    const canvas = this.meshCanvasRef?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement!.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas.parentElement!);

    // Create nodes
    for (let i = 0; i < 60; i++) {
      this.meshNodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1
      });
    }

    this.ngZone.runOutsideAngular(() => {
      const animate = () => {
        this.animFrameId = requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw nodes
        for (const node of this.meshNodes) {
          // Mouse repulsion
          const dx = node.x - this.mouseX;
          const dy = node.y - this.mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 0) {
            const force = (120 - dist) / 120 * 0.8;
            node.vx += (dx / dist) * force;
            node.vy += (dy / dist) * force;
          }

          // Damping
          node.vx *= 0.98;
          node.vy *= 0.98;

          node.x += node.vx;
          node.y += node.vy;

          // Bounce off walls
          if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
          if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
          node.x = Math.max(0, Math.min(canvas.width, node.x));
          node.y = Math.max(0, Math.min(canvas.height, node.y));

          // Draw node
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.fill();
        }

        // Draw connections
        for (let i = 0; i < this.meshNodes.length; i++) {
          for (let j = i + 1; j < this.meshNodes.length; j++) {
            const a = this.meshNodes[i];
            const b = this.meshNodes[j];
            const d = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
            if (d < 150) {
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - d / 150)})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      };
      animate();
    });
  }

  onMeshMouseMove(event: MouseEvent) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.mouseX = event.clientX - rect.left;
    this.mouseY = event.clientY - rect.top;
  }

  onMeshMouseLeave() {
    this.mouseX = -1000;
    this.mouseY = -1000;
  }

  getBarWidth(count: number): number {
    return (count / this.maxClassCount) * 100;
  }

  openFeatureDialog() {
    this.dialog.open(FeatureRequestDialogComponent, { width: '500px' });
  }
}
