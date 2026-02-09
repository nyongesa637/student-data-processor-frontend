import { Component, OnInit, OnDestroy, ElementRef, ViewChild, NgZone, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
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
import { SettingsService } from '../../services/settings.service';

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
    .dialog-container { padding: 24px; max-width: 100%; box-sizing: border-box; }
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
      <!-- Action Cards - each with own mesh -->
      <div class="action-cards">
        <div class="action-card get-started"
             (mousemove)="onCardMouseMove($event, 0)"
             (mouseleave)="onCardMouseLeave(0)">
          <canvas #cardCanvas class="card-mesh-canvas"></canvas>
          <div class="card-overlay"></div>
          <div class="card-content">
            <mat-icon class="card-icon">rocket_launch</mat-icon>
            <h2>Get Started</h2>
            <p>Generate student data to begin your data processing workflow</p>
            <button mat-raised-button routerLink="/generate" class="card-btn get-started-btn">
              <mat-icon>arrow_forward</mat-icon> Generate Data
            </button>
          </div>
        </div>
        <div class="action-card request-feature"
             (mousemove)="onCardMouseMove($event, 1)"
             (mouseleave)="onCardMouseLeave(1)">
          <canvas #cardCanvas class="card-mesh-canvas"></canvas>
          <div class="card-content">
            <mat-icon class="card-icon">lightbulb</mat-icon>
            <h2>Request Feature</h2>
            <p>Have an idea? Submit a feature request and help shape the app</p>
            <button mat-raised-button (click)="openFeatureDialog()" class="card-btn feature-btn">
              <mat-icon>add</mat-icon> Request Feature
            </button>
          </div>
        </div>
      </div>

      <!-- Steps Timeline -->
      <div class="timeline-section">
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
        <h3 class="section-title">Analytics Summary</h3>
        <mat-progress-bar *ngIf="loadingAnalytics" mode="indeterminate"></mat-progress-bar>
        <div class="analytics-grid" *ngIf="!loadingAnalytics">
          <div class="stat-card">
            <div class="stat-info">
              <span class="stat-value">{{ analytics?.totalStudents | number }}</span>
              <span class="stat-label">Total Students</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-info">
              <span class="stat-value">{{ analytics?.averageScore }}</span>
              <span class="stat-label">Average Score</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-info">
              <span class="stat-value">{{ analytics?.highestScore }}</span>
              <span class="stat-label">Highest Score</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-info">
              <span class="stat-value">{{ analytics?.lowestScore }}</span>
              <span class="stat-label">Lowest Score</span>
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
          <a routerLink="/report" class="view-more">View all in Report &rarr;</a>
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
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      cursor: default;
      min-height: 220px;
      display: flex;
      align-items: stretch;

      .card-mesh-canvas {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0;
      }

      .card-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        pointer-events: none;
      }

      .card-content {
        position: relative;
        z-index: 2;
        padding: 32px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;

        .card-icon {
          font-size: 40px;
          width: 40px;
          height: 40px;
          margin-bottom: 12px;
        }

        h2 {
          margin: 0 0 8px;
          font-size: 22px;
          font-weight: 600;
        }

        p {
          margin: 0 0 20px;
          font-size: 14px;
          line-height: 1.5;
        }

        .card-btn {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          border: 1px solid var(--border);
          box-shadow: none;

          mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
          }
        }
      }

      &.get-started {
        background: var(--surface);
        border: 1px solid var(--border);

        .card-overlay {
          background: rgba(var(--primary-rgb, 14, 165, 233), 0.06);
        }

        .card-content {
          color: var(--text);

          .card-icon { color: var(--primary); opacity: 0.9; }
          p { color: var(--text-secondary); }

          .get-started-btn {
            background: var(--primary);
            color: white;
            border-color: var(--primary);
          }
        }
      }

      &.request-feature {
        background: var(--surface);
        border: 1px solid var(--border);

        .card-content {
          color: var(--text);

          .card-icon { color: var(--primary); opacity: 0.9; }
          p { color: var(--text-secondary); }

          .feature-btn {
            background: var(--surface);
            color: var(--text);
            border: 1px solid var(--border);
          }
        }
      }

      &:hover {
        transform: translateY(-2px);
        transition: transform 0.2s ease;
      }
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--text, #1f2937);
      margin-bottom: 20px;
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
        background: linear-gradient(to right, var(--primary, #0ea5e9), rgba(var(--primary-rgb, 14, 165, 233), 0.4));
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
      padding: 16px;
      background: var(--bg, #f8fafc);
      border-radius: 10px;
      border: 1px solid var(--border, #e5e7eb);

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
      .timeline {
        flex-direction: column;
        gap: 0;
      }
      .timeline-step {
        flex-direction: row;
        align-items: flex-start;
        min-width: auto;
        padding-bottom: 24px;

        .step-circle {
          flex-shrink: 0;
        }

        .step-info {
          text-align: left;
          margin-top: 0;
          margin-left: 16px;
        }

        .timeline-connector {
          top: 52px;
          left: 26px;
          width: 2px !important;
          height: calc(100% - 40px) !important;
          background: linear-gradient(to bottom, var(--primary, #0ea5e9), rgba(var(--primary-rgb, 14, 165, 233), 0.4)) !important;
        }
      }
    }
  `]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  analytics: any = null;
  loadingAnalytics = true;

  @ViewChildren('cardCanvas') cardCanvasRefs!: QueryList<ElementRef<HTMLCanvasElement>>;

  private cardMeshNodes: MeshNode[][] = [[], []];
  private animFrameIds: number[] = [0, 0];
  private cardMouseX: number[] = [-1000, -1000];
  private cardMouseY: number[] = [-1000, -1000];

  steps = [
    { name: 'Generate Data', description: 'Create Excel file', icon: 'dataset', route: '/generate' },
    { name: 'Process Excel', description: 'Convert to CSV (+10)', icon: 'transform', route: '/process' },
    { name: 'Upload CSV', description: 'Store in database (+5)', icon: 'cloud_upload', route: '/upload' },
    { name: 'View Reports', description: 'Analyze & export', icon: 'assessment', route: '/report' }
  ];

  private primaryRgb = '14, 165, 233';

  constructor(
    private api: ApiService,
    private toast: ToastService,
    private dialog: MatDialog,
    private router: Router,
    private ngZone: NgZone,
    private settingsService: SettingsService
  ) {}

  ngOnInit() {
    // Track primary color for mesh canvas
    const colorOpt = this.settingsService.colorOptions.find(c => c.value === this.settingsService.current.primaryColor);
    if (colorOpt) this.primaryRgb = colorOpt.rgb;

    this.api.getAnalyticsSummary().subscribe({
      next: (data) => {
        this.analytics = data;
        this.loadingAnalytics = false;
      },
      error: () => {
        this.loadingAnalytics = false;
      }
    });
  }

  ngAfterViewInit() {
    const canvases = this.cardCanvasRefs.toArray();
    if (canvases.length >= 2) {
      this.initCardMesh(canvases[0].nativeElement, 0);
      this.initCardMesh(canvases[1].nativeElement, 1);
    }
  }

  ngOnDestroy() {
    this.animFrameIds.forEach(id => { if (id) cancelAnimationFrame(id); });
  }

  private initCardMesh(canvas: HTMLCanvasElement, index: number) {
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

    const nodeCount = 65;
    this.cardMeshNodes[index] = [];
    for (let i = 0; i < nodeCount; i++) {
      this.cardMeshNodes[index].push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1
      });
    }

    // Use primary color for mesh
    const rgb = this.primaryRgb;
    const nodeColor = `rgba(${rgb}, 0.5)`;
    const lineColor = (opacity: number) => `rgba(${rgb}, ${opacity})`;

    this.ngZone.runOutsideAngular(() => {
      const animate = () => {
        this.animFrameIds[index] = requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const nodes = this.cardMeshNodes[index];
        for (const node of nodes) {
          const dx = node.x - this.cardMouseX[index];
          const dy = node.y - this.cardMouseY[index];
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100 && dist > 0) {
            const force = (100 - dist) / 100 * 0.6;
            node.vx += (dx / dist) * force;
            node.vy += (dy / dist) * force;
          }

          node.vx *= 0.98;
          node.vy *= 0.98;
          node.x += node.vx;
          node.y += node.vy;

          if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
          if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
          node.x = Math.max(0, Math.min(canvas.width, node.x));
          node.y = Math.max(0, Math.min(canvas.height, node.y));

          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.fillStyle = nodeColor;
          ctx.fill();
        }

        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const a = nodes[i];
            const b = nodes[j];
            const d = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
            if (d < 120) {
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = lineColor(0.12 * (1 - d / 120));
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      };
      animate();
    });
  }

  onCardMouseMove(event: MouseEvent, index: number) {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.cardMouseX[index] = event.clientX - rect.left;
    this.cardMouseY[index] = event.clientY - rect.top;
  }

  onCardMouseLeave(index: number) {
    this.cardMouseX[index] = -1000;
    this.cardMouseY[index] = -1000;
  }

  openFeatureDialog() {
    this.dialog.open(FeatureRequestDialogComponent, { width: '500px', maxWidth: '92vw' });
  }
}
