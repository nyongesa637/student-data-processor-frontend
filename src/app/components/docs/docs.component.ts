import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-docs',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  template: `
    <div class="docs">
      <div class="docs-header">
        <h1>Documentation</h1>
        <p>Learn how to use the Student Data Processor step by step.</p>
      </div>

      <nav class="docs-nav">
        <a *ngFor="let section of sections"
           (click)="scrollTo(section.id)"
           class="docs-nav-item">
          <mat-icon>{{ section.icon }}</mat-icon>
          <span>{{ section.title }}</span>
        </a>
      </nav>

      <div class="docs-content">
        <!-- Overview -->
        <section id="overview" class="doc-section">
          <h2><mat-icon>info</mat-icon> Overview</h2>
          <p>
            The Student Data Processor (SDP) is a full-stack application for generating,
            transforming, and analyzing student data. The workflow consists of four main steps:
            generating Excel data, processing it into CSV with score adjustments, uploading
            to a PostgreSQL database, and viewing reports with analytics.
          </p>
          <div class="info-box">
            <strong>Tech Stack:</strong> Angular 18 frontend, Spring Boot 3 backend,
            PostgreSQL database, Apache POI for Excel processing.
          </div>
        </section>

        <!-- Generate -->
        <section id="generate" class="doc-section">
          <h2><mat-icon>dataset</mat-icon> Generate Data</h2>
          <p>
            The data generation step creates an Excel (.xlsx) file containing randomly
            generated student records with fields: Student ID, First Name, Last Name,
            Class, and Score.
          </p>
          <h3>How to use:</h3>
          <ol>
            <li>Navigate to <a routerLink="/generate">Generate Data</a></li>
            <li>Enter the number of records (1 to 1,000,000)</li>
            <li>Click "Generate Excel"</li>
            <li>The file will be saved to the server's output directory</li>
          </ol>
          <div class="info-box">
            <strong>Tip:</strong> Large record counts (100K+) may take a few seconds.
            A progress bar indicates the operation is in progress.
          </div>
        </section>

        <!-- Process -->
        <section id="process" class="doc-section">
          <h2><mat-icon>transform</mat-icon> Process Excel</h2>
          <p>
            Processing reads an Excel file, adds 10 points to each student's score,
            and outputs a CSV file. This simulates a data transformation pipeline.
          </p>
          <h3>How to use:</h3>
          <ol>
            <li>Navigate to <a routerLink="/process">Process Excel</a></li>
            <li>Select an .xlsx or .xls file using the file picker</li>
            <li>Click "Process File"</li>
            <li>The resulting CSV will be saved on the server</li>
          </ol>
          <div class="info-box">
            <strong>Score adjustment:</strong> Each student's score is increased by 10 points
            during the Excel-to-CSV conversion.
          </div>
        </section>

        <!-- Upload -->
        <section id="upload" class="doc-section">
          <h2><mat-icon>cloud_upload</mat-icon> Upload CSV</h2>
          <p>
            The upload step reads a CSV file and inserts the records into the PostgreSQL
            database, adding an additional 5 points to each score.
          </p>
          <h3>How to use:</h3>
          <ol>
            <li>Navigate to <a routerLink="/upload">Upload CSV</a></li>
            <li>Select a .csv file</li>
            <li>Click "Upload to Database"</li>
            <li>Records will be inserted and a count displayed</li>
          </ol>
        </section>

        <!-- Reports -->
        <section id="reports" class="doc-section">
          <h2><mat-icon>assessment</mat-icon> Reports</h2>
          <p>
            The report page displays all student records stored in the database with
            pagination, search, and class filtering capabilities.
          </p>
          <h3>Features:</h3>
          <ul>
            <li>Search by student ID, name, or class</li>
            <li>Filter by specific class</li>
            <li>Paginated table with sortable columns</li>
            <li>Export to Excel, CSV, or PDF formats</li>
          </ul>
        </section>

        <!-- Analytics -->
        <section id="analytics" class="doc-section">
          <h2><mat-icon>analytics</mat-icon> Analytics</h2>
          <p>
            The home dashboard provides an analytics summary including total students,
            average/highest/lowest scores, class distribution charts, and recent records.
          </p>
        </section>

        <!-- Notifications -->
        <section id="notifications" class="doc-section">
          <h2><mat-icon>notifications</mat-icon> Notifications</h2>
          <p>
            The notification system alerts you when operations complete. Notifications
            appear as a badge on the bell icon in the header toolbar. Click to view
            details and mark as read.
          </p>
          <h3>Notification types:</h3>
          <ul>
            <li><strong>GENERATION</strong> - Data generation completed</li>
            <li><strong>PROCESSING</strong> - Excel processing completed</li>
            <li><strong>UPLOAD</strong> - CSV upload completed</li>
          </ul>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .docs {
      max-width: 900px;
      margin: 0 auto;
    }

    .docs-header {
      margin-bottom: 24px;

      h1 {
        font-size: 28px;
        font-weight: 700;
        color: var(--text, #1f2937);
        margin: 0 0 8px;
      }

      p {
        color: var(--text-secondary, #6b7280);
        font-size: 15px;
        margin: 0;
      }
    }

    .docs-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 32px;
      padding: 16px;
      background: var(--surface, white);
      border: 1px solid var(--border, #e5e7eb);
      border-radius: 10px;

      .docs-nav-item {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        border-radius: 6px;
        font-size: 13px;
        color: var(--text-secondary, #6b7280);
        cursor: pointer;
        transition: all 0.2s;
        text-decoration: none;

        &:hover {
          background: var(--primary-light, #e0f2fe);
          color: var(--primary, #0ea5e9);
        }

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
      }
    }

    .docs-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .doc-section {
      background: var(--surface, white);
      border: 1px solid var(--border, #e5e7eb);
      border-radius: 10px;
      padding: 24px;

      h2 {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 20px;
        font-weight: 600;
        color: var(--text, #1f2937);
        margin: 0 0 12px;

        mat-icon { color: var(--primary, #0ea5e9); }
      }

      h3 {
        font-size: 15px;
        font-weight: 600;
        color: var(--text, #1f2937);
        margin: 16px 0 8px;
      }

      p {
        color: var(--text-secondary, #6b7280);
        font-size: 14px;
        line-height: 1.6;
        margin: 0 0 8px;
      }

      ol, ul {
        color: var(--text-secondary, #6b7280);
        font-size: 14px;
        line-height: 1.8;
        padding-left: 24px;
        margin: 0;
      }

      a {
        color: var(--primary, #0ea5e9);
        text-decoration: none;
        &:hover { text-decoration: underline; }
      }
    }

    .info-box {
      background: var(--primary-light, #e0f2fe);
      border: 1px solid var(--primary, #0ea5e9);
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 13px;
      color: var(--text, #1f2937);
      margin-top: 12px;
      line-height: 1.5;
    }
  `]
})
export class DocsComponent {
  sections = [
    { id: 'overview', title: 'Overview', icon: 'info' },
    { id: 'generate', title: 'Generate', icon: 'dataset' },
    { id: 'process', title: 'Process', icon: 'transform' },
    { id: 'upload', title: 'Upload', icon: 'cloud_upload' },
    { id: 'reports', title: 'Reports', icon: 'assessment' },
    { id: 'analytics', title: 'Analytics', icon: 'analytics' },
    { id: 'notifications', title: 'Notifications', icon: 'notifications' }
  ];

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
