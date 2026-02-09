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
        <div class="docs-header-content">
          <h1>Documentation</h1>
          <p>Complete reference guide for the Student Data Processor application.</p>
        </div>
        <div class="docs-version">
          <span class="version-badge">v1.0.0</span>
        </div>
      </div>

      <nav class="docs-nav">
        <span class="nav-label">Jump to</span>
        <a *ngFor="let section of sections"
           (click)="scrollTo(section.id)"
           [class.active]="activeSection === section.id"
           class="docs-nav-item">
          <mat-icon>{{ section.icon }}</mat-icon>
          <span>{{ section.title }}</span>
        </a>
      </nav>

      <div class="docs-content">
        <!-- Getting Started -->
        <section id="getting-started" class="doc-section">
          <h2><mat-icon>rocket_launch</mat-icon> Getting Started</h2>
          <p>
            The Student Data Processor (SDP) is a full-stack data pipeline application designed for generating,
            transforming, storing, and analyzing student records. It provides an end-to-end workflow from
            raw data generation through to final reporting and analytics.
          </p>

          <h3>Quick Start</h3>
          <div class="steps-grid">
            <div class="quick-step" *ngFor="let step of quickSteps; let i = index">
              <div class="step-number">{{ i + 1 }}</div>
              <div class="step-content">
                <strong>{{ step.title }}</strong>
                <span>{{ step.desc }}</span>
                <a [routerLink]="step.route" class="step-link">
                  Go to {{ step.title }} <mat-icon>arrow_forward</mat-icon>
                </a>
              </div>
            </div>
          </div>

          <div class="info-box">
            <mat-icon>info</mat-icon>
            <div>
              <strong>Prerequisite:</strong> Ensure the backend server is running at
              <code>localhost:9090</code> with a connected PostgreSQL database before using the application.
            </div>
          </div>
        </section>

        <!-- Architecture -->
        <section id="architecture" class="doc-section">
          <h2><mat-icon>account_tree</mat-icon> Architecture</h2>
          <p>
            SDP follows a standard client-server architecture with a clear separation between the
            frontend presentation layer and the backend data processing layer.
          </p>

          <h3>Tech Stack</h3>
          <div class="tech-grid">
            <div class="tech-item">
              <div class="tech-label">Frontend</div>
              <div class="tech-value">Angular 18 with Angular Material</div>
            </div>
            <div class="tech-item">
              <div class="tech-label">Backend</div>
              <div class="tech-value">Spring Boot 3 (Java 17+)</div>
            </div>
            <div class="tech-item">
              <div class="tech-label">Database</div>
              <div class="tech-value">PostgreSQL with JPA/Hibernate</div>
            </div>
            <div class="tech-item">
              <div class="tech-label">File Processing</div>
              <div class="tech-value">Apache POI (Excel), OpenCSV</div>
            </div>
            <div class="tech-item">
              <div class="tech-label">Containerization</div>
              <div class="tech-value">Docker & Docker Compose</div>
            </div>
            <div class="tech-item">
              <div class="tech-label">Real-time</div>
              <div class="tech-value">Server-Sent Events (SSE)</div>
            </div>
          </div>

          <h3>Data Flow</h3>
          <div class="flow-diagram">
            <div class="flow-step">
              <mat-icon>dataset</mat-icon>
              <span>Generate Excel</span>
            </div>
            <mat-icon class="flow-arrow">arrow_forward</mat-icon>
            <div class="flow-step">
              <mat-icon>transform</mat-icon>
              <span>Process to CSV (+10)</span>
            </div>
            <mat-icon class="flow-arrow">arrow_forward</mat-icon>
            <div class="flow-step">
              <mat-icon>cloud_upload</mat-icon>
              <span>Upload to DB (+5)</span>
            </div>
            <mat-icon class="flow-arrow">arrow_forward</mat-icon>
            <div class="flow-step">
              <mat-icon>assessment</mat-icon>
              <span>View Reports</span>
            </div>
          </div>

          <h3>Score Transformation Pipeline</h3>
          <p>
            Scores undergo two additive transformations through the pipeline:
          </p>
          <div class="score-pipeline">
            <div class="pipeline-item">
              <span class="pipeline-stage">Original</span>
              <span class="pipeline-value">Score = X</span>
            </div>
            <mat-icon>arrow_forward</mat-icon>
            <div class="pipeline-item">
              <span class="pipeline-stage">After Processing</span>
              <span class="pipeline-value">Score = X + 10</span>
            </div>
            <mat-icon>arrow_forward</mat-icon>
            <div class="pipeline-item">
              <span class="pipeline-stage">After Upload</span>
              <span class="pipeline-value">Score = X + 15</span>
            </div>
          </div>
        </section>

        <!-- Generate Data -->
        <section id="generate" class="doc-section">
          <h2><mat-icon>dataset</mat-icon> Generate Data</h2>
          <p>
            The data generation module creates synthetic student records in Excel (.xlsx) format.
            Each record contains a unique Student ID, randomized names, date of birth, class assignment,
            and score.
          </p>

          <h3>How to Use</h3>
          <ol>
            <li>Navigate to <a routerLink="/generate">Generate Data</a> from the sidebar or dashboard</li>
            <li>Enter the desired number of records (1 to 1,000,000)</li>
            <li>Click <strong>Generate Excel</strong> to start the process</li>
            <li>A progress indicator will display during generation</li>
            <li>On success, a data preview table appears on the right showing sample records</li>
            <li>The generated file is saved to the server's output directory</li>
          </ol>

          <h3>Generated Fields</h3>
          <table class="ref-table">
            <thead>
              <tr>
                <th>Field</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Student ID</td><td>String</td><td>Unique identifier (format: STU000001)</td></tr>
              <tr><td>First Name</td><td>String</td><td>Randomly selected from a name pool</td></tr>
              <tr><td>Last Name</td><td>String</td><td>Randomly selected from a name pool</td></tr>
              <tr><td>Date of Birth</td><td>Date</td><td>Random date between 1998-2005</td></tr>
              <tr><td>Class</td><td>String</td><td>One of: Class A, B, C, D, or E</td></tr>
              <tr><td>Score</td><td>Integer</td><td>Random value between 0 and 100</td></tr>
            </tbody>
          </table>

          <div class="info-box">
            <mat-icon>tips_and_updates</mat-icon>
            <div>
              <strong>Performance:</strong> Generation of 100,000 records typically completes in
              a few seconds. Very large datasets (1M records) may take longer depending on server resources.
              The file is streamed to disk to minimize memory usage.
            </div>
          </div>
        </section>

        <!-- Process Excel -->
        <section id="process" class="doc-section">
          <h2><mat-icon>transform</mat-icon> Process Excel</h2>
          <p>
            The processing step reads an Excel (.xlsx or .xls) file, applies a score transformation
            (+10 points to each student's score), and outputs the result as a CSV file. This simulates
            a real-world data transformation pipeline.
          </p>

          <h3>How to Use</h3>
          <ol>
            <li>Navigate to <a routerLink="/process">Process Excel</a></li>
            <li>Click the file input to select an Excel file (.xlsx or .xls)</li>
            <li>The selected filename will be displayed for confirmation</li>
            <li>Click <strong>Process File</strong> to begin the conversion</li>
            <li>On success, a preview shows sample rows with the adjusted scores</li>
            <li>The output CSV file is saved on the server</li>
          </ol>

          <h3>What Happens During Processing</h3>
          <ul>
            <li>The Excel file is uploaded to the backend via multipart form data</li>
            <li>Apache POI reads each row from the workbook</li>
            <li>Each student's score is incremented by <strong>10 points</strong></li>
            <li>All data is written to a new CSV file using OpenCSV</li>
            <li>The output filename and metadata are returned to the frontend</li>
          </ul>

          <div class="warning-box">
            <mat-icon>warning</mat-icon>
            <div>
              <strong>File Format:</strong> Only .xlsx and .xls files are accepted. The file must follow
              the expected column structure (Student ID, First Name, Last Name, DOB, Class, Score).
              Files generated by the Generate Data step are guaranteed to be compatible.
            </div>
          </div>
        </section>

        <!-- Upload CSV -->
        <section id="upload" class="doc-section">
          <h2><mat-icon>cloud_upload</mat-icon> Upload CSV</h2>
          <p>
            The upload step reads a CSV file and persists the records into a PostgreSQL database.
            An additional +5 score adjustment is applied during the import, bringing the total
            pipeline adjustment to +15 points from the original generated score.
          </p>

          <h3>How to Use</h3>
          <ol>
            <li>Navigate to <a routerLink="/upload">Upload CSV</a></li>
            <li>Select a .csv file using the file picker</li>
            <li>Click <strong>Upload to Database</strong></li>
            <li>The progress bar indicates the upload and insertion process</li>
            <li>On success, a preview table shows the first 15 records from the database</li>
            <li>The total number of inserted records is displayed</li>
          </ol>

          <h3>Database Schema</h3>
          <table class="ref-table">
            <thead>
              <tr>
                <th>Column</th>
                <th>Type</th>
                <th>Constraints</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>id</td><td>BIGINT</td><td>Primary key, auto-generated</td></tr>
              <tr><td>student_id</td><td>VARCHAR</td><td>Unique, not null</td></tr>
              <tr><td>first_name</td><td>VARCHAR</td><td>Not null</td></tr>
              <tr><td>last_name</td><td>VARCHAR</td><td>Not null</td></tr>
              <tr><td>dob</td><td>DATE</td><td>Date of birth</td></tr>
              <tr><td>student_class</td><td>VARCHAR</td><td>Class assignment</td></tr>
              <tr><td>score</td><td>INTEGER</td><td>Final adjusted score</td></tr>
            </tbody>
          </table>

          <div class="info-box">
            <mat-icon>info</mat-icon>
            <div>
              <strong>Duplicate Handling:</strong> If a student ID already exists in the database,
              the upload will update the existing record with the new data.
            </div>
          </div>
        </section>

        <!-- Reports -->
        <section id="reports" class="doc-section">
          <h2><mat-icon>assessment</mat-icon> Reports</h2>
          <p>
            The report page provides a comprehensive view of all student records stored in the database,
            with search, filtering, pagination, and multi-format export capabilities.
          </p>

          <h3>Features</h3>
          <div class="feature-grid">
            <div class="feature-item">
              <mat-icon>search</mat-icon>
              <div>
                <strong>Search</strong>
                <span>Find students by ID, name, or any field. Results update on Enter or Search click.</span>
              </div>
            </div>
            <div class="feature-item">
              <mat-icon>filter_list</mat-icon>
              <div>
                <strong>Class Filter</strong>
                <span>Filter the table by a specific class (A through E) or view all classes.</span>
              </div>
            </div>
            <div class="feature-item">
              <mat-icon>view_list</mat-icon>
              <div>
                <strong>Pagination</strong>
                <span>Navigate through large datasets with configurable page sizes (10, 25, 50, 100).</span>
              </div>
            </div>
            <div class="feature-item">
              <mat-icon>download</mat-icon>
              <div>
                <strong>Export</strong>
                <span>Download filtered data as Excel (.xlsx), CSV (.csv), or PDF format.</span>
              </div>
            </div>
          </div>

          <h3>Mobile Experience</h3>
          <p>
            On mobile devices, the filter and export controls are accessible via a floating action bar
            at the bottom of the screen. Tapping "Filter" or "Export" opens a bottom drawer
            with the respective options. The data table scrolls horizontally to accommodate all columns.
          </p>

          <h3>Export Formats</h3>
          <table class="ref-table">
            <thead>
              <tr>
                <th>Format</th>
                <th>Extension</th>
                <th>Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Excel</td><td>.xlsx</td><td>Spreadsheet analysis, formulas, charts</td></tr>
              <tr><td>CSV</td><td>.csv</td><td>Data import into other systems, lightweight sharing</td></tr>
              <tr><td>PDF</td><td>.pdf</td><td>Printing, formal reports, read-only distribution</td></tr>
            </tbody>
          </table>
        </section>

        <!-- Dashboard & Analytics -->
        <section id="analytics" class="doc-section">
          <h2><mat-icon>analytics</mat-icon> Dashboard & Analytics</h2>
          <p>
            The home dashboard provides an at-a-glance summary of your data, quick action cards,
            and a visual workflow timeline.
          </p>

          <h3>Summary Cards</h3>
          <ul>
            <li><strong>Total Students</strong> -- Number of records in the database</li>
            <li><strong>Average Score</strong> -- Mean score across all students</li>
            <li><strong>Highest Score</strong> -- Maximum score recorded</li>
            <li><strong>Lowest Score</strong> -- Minimum score recorded</li>
          </ul>

          <h3>Action Cards</h3>
          <p>
            Two interactive cards with animated mesh backgrounds provide quick access to key actions:
          </p>
          <ul>
            <li><strong>Get Started</strong> -- Jump directly to the data generation page</li>
            <li><strong>Request Feature</strong> -- Open a dialog to submit ideas and suggestions for the app</li>
          </ul>

          <h3>Recent Records</h3>
          <p>
            A table of the most recently added student records is displayed at the bottom
            of the analytics section, with a link to view the full report.
          </p>
        </section>

        <!-- Notifications -->
        <section id="notifications" class="doc-section">
          <h2><mat-icon>notifications</mat-icon> Notifications</h2>
          <p>
            SDP includes a real-time notification system that alerts you when background operations
            complete. Notifications appear as a badge counter on the bell icon in the header toolbar.
          </p>

          <h3>Notification Types</h3>
          <table class="ref-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Icon</th>
                <th>Triggered When</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>GENERATION</td><td>dataset</td><td>Excel file generation completes</td></tr>
              <tr><td>PROCESSING</td><td>transform</td><td>Excel-to-CSV processing completes</td></tr>
              <tr><td>UPLOAD</td><td>cloud_upload</td><td>CSV-to-database upload completes</td></tr>
            </tbody>
          </table>

          <h3>Managing Notifications</h3>
          <ul>
            <li>Click the bell icon to open the notification panel</li>
            <li>Click an individual notification to mark it as read</li>
            <li>Use <strong>Mark all read</strong> to clear the unread badge</li>
            <li>Notifications are polled from the server every 30 seconds</li>
          </ul>
        </section>

        <!-- Keyboard Shortcuts -->
        <section id="shortcuts" class="doc-section">
          <h2><mat-icon>keyboard</mat-icon> Keyboard Shortcuts</h2>
          <p>
            Use keyboard shortcuts to navigate the application more efficiently.
          </p>

          <table class="ref-table">
            <thead>
              <tr>
                <th>Shortcut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><kbd>Ctrl</kbd> + <kbd>K</kbd></td>
                <td>Focus the global search bar</td>
              </tr>
            </tbody>
          </table>

          <h3>Global Search</h3>
          <p>
            The global search bar in the header searches across pages, quick actions, and student records.
            Start typing to see results grouped by category. Results appear after 2 or more characters.
            Student search queries are debounced (300ms) to reduce API calls.
          </p>
        </section>

        <!-- Changelog & Help -->
        <section id="changelog" class="doc-section">
          <h2><mat-icon>update</mat-icon> Changelog & Help</h2>
          <p>
            The floating chat button in the bottom-right corner provides access to two utilities:
          </p>

          <h3>Changelog</h3>
          <p>
            View a live feed of application updates delivered via Server-Sent Events (SSE).
            New releases appear automatically without refreshing the page. By default, only
            frontend changes are shown.
          </p>

          <h3>Help Chat</h3>
          <p>
            A command-based help system lets you quickly navigate the app. Type <code>/</code>
            to see all available commands:
          </p>
          <table class="ref-table">
            <thead>
              <tr>
                <th>Command</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><code>/dashboard</code></td><td>Navigate to the dashboard overview</td></tr>
              <tr><td><code>/generate</code></td><td>Navigate to data generation</td></tr>
              <tr><td><code>/process</code></td><td>Navigate to Excel processing</td></tr>
              <tr><td><code>/upload</code></td><td>Navigate to CSV upload</td></tr>
              <tr><td><code>/report</code></td><td>Navigate to student reports</td></tr>
              <tr><td><code>/docs</code></td><td>Navigate to this documentation</td></tr>
            </tbody>
          </table>
        </section>

        <!-- API Reference -->
        <section id="api" class="doc-section">
          <h2><mat-icon>api</mat-icon> API Reference</h2>
          <p>
            The backend exposes a RESTful API at <code>http://localhost:9090/api</code>.
            Below are the primary endpoints used by the frontend.
          </p>

          <div class="api-endpoint" *ngFor="let ep of apiEndpoints">
            <div class="api-method" [class]="ep.method.toLowerCase()">{{ ep.method }}</div>
            <div class="api-details">
              <code class="api-path">{{ ep.path }}</code>
              <span class="api-desc">{{ ep.desc }}</span>
            </div>
          </div>
        </section>

        <!-- Troubleshooting -->
        <section id="troubleshooting" class="doc-section">
          <h2><mat-icon>build</mat-icon> Troubleshooting</h2>

          <div class="faq-item" *ngFor="let faq of faqs">
            <h3>{{ faq.q }}</h3>
            <p>{{ faq.a }}</p>
          </div>
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
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
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

    .version-badge {
      font-size: 12px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 6px;
      background: var(--primary-light, #e0f2fe);
      color: var(--primary, #0ea5e9);
    }

    .docs-nav {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      align-items: center;
      margin-bottom: 32px;
      padding: 12px 16px;
      background: var(--surface, white);
      border: 1px solid var(--border, #e5e7eb);
      border-radius: 10px;

      .nav-label {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--text-muted, #9ca3af);
        margin-right: 8px;
      }

      .docs-nav-item {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 5px 12px;
        border-radius: 6px;
        font-size: 12px;
        color: var(--text-secondary, #6b7280);
        cursor: pointer;
        transition: all 0.2s;
        text-decoration: none;

        &:hover, &.active {
          background: var(--primary-light, #e0f2fe);
          color: var(--primary, #0ea5e9);
        }

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
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
      padding: 28px;

      h2 {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 20px;
        font-weight: 600;
        color: var(--text, #1f2937);
        margin: 0 0 14px;

        mat-icon { color: var(--primary, #0ea5e9); }
      }

      h3 {
        font-size: 15px;
        font-weight: 600;
        color: var(--text, #1f2937);
        margin: 20px 0 10px;
      }

      p {
        color: var(--text-secondary, #6b7280);
        font-size: 14px;
        line-height: 1.7;
        margin: 0 0 8px;
      }

      ol, ul {
        color: var(--text-secondary, #6b7280);
        font-size: 14px;
        line-height: 1.9;
        padding-left: 24px;
        margin: 0 0 8px;
      }

      a {
        color: var(--primary, #0ea5e9);
        text-decoration: none;
        &:hover { text-decoration: underline; }
      }

      code {
        font-family: 'Roboto Mono', monospace;
        font-size: 13px;
        background: var(--bg, #f8fafc);
        padding: 2px 6px;
        border-radius: 4px;
        border: 1px solid var(--border, #e5e7eb);
        color: var(--text, #1f2937);
      }

      kbd {
        display: inline-block;
        font-family: 'Roboto Mono', monospace;
        font-size: 11px;
        padding: 2px 6px;
        border-radius: 4px;
        border: 1px solid var(--border, #e5e7eb);
        background: var(--bg, #f8fafc);
        box-shadow: 0 1px 0 var(--border, #e5e7eb);
        color: var(--text, #1f2937);
        font-weight: 600;
      }
    }

    .info-box, .warning-box {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 13px;
      line-height: 1.6;
      margin-top: 14px;
      color: var(--text, #1f2937);

      mat-icon {
        flex-shrink: 0;
        font-size: 20px;
        width: 20px;
        height: 20px;
        margin-top: 1px;
      }
    }

    .info-box {
      background: var(--primary-light, #e0f2fe);
      border: 1px solid rgba(14, 165, 233, 0.3);

      mat-icon { color: var(--primary, #0ea5e9); }
    }

    .warning-box {
      background: #fff8e1;
      border: 1px solid rgba(255, 152, 0, 0.3);

      mat-icon { color: #f59e0b; }
    }

    /* Quick steps */
    .steps-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 12px;
    }

    .quick-step {
      display: flex;
      gap: 14px;
      align-items: flex-start;
      padding: 14px 16px;
      background: var(--bg, #f8fafc);
      border: 1px solid var(--border, #e5e7eb);
      border-radius: 8px;

      .step-number {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: var(--primary, #0ea5e9);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        font-weight: 600;
        flex-shrink: 0;
      }

      .step-content {
        display: flex;
        flex-direction: column;
        gap: 3px;
        font-size: 13px;

        strong { color: var(--text, #1f2937); }
        span { color: var(--text-secondary, #6b7280); }

        .step-link {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          font-size: 12px;
          font-weight: 500;
          color: var(--primary, #0ea5e9);
          text-decoration: none;
          margin-top: 4px;

          mat-icon {
            font-size: 14px;
            width: 14px;
            height: 14px;
          }

          &:hover { text-decoration: underline; }
        }
      }
    }

    /* Tech grid */
    .tech-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 10px;
      margin-top: 10px;
    }

    .tech-item {
      padding: 10px 14px;
      background: var(--bg, #f8fafc);
      border: 1px solid var(--border, #e5e7eb);
      border-radius: 6px;

      .tech-label {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        color: var(--text-muted, #9ca3af);
        margin-bottom: 2px;
      }

      .tech-value {
        font-size: 13px;
        color: var(--text, #1f2937);
        font-weight: 500;
      }
    }

    /* Flow diagram */
    .flow-diagram {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 14px 0;
      padding: 16px;
      background: var(--bg, #f8fafc);
      border: 1px solid var(--border, #e5e7eb);
      border-radius: 8px;
      overflow-x: auto;

      .flow-step {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 6px;
        min-width: 100px;
        text-align: center;

        mat-icon {
          font-size: 28px;
          width: 28px;
          height: 28px;
          color: var(--primary, #0ea5e9);
        }

        span {
          font-size: 12px;
          font-weight: 500;
          color: var(--text, #1f2937);
        }
      }

      .flow-arrow {
        color: var(--text-muted, #9ca3af);
        font-size: 20px;
        flex-shrink: 0;
      }
    }

    /* Score pipeline */
    .score-pipeline {
      display: flex;
      align-items: center;
      gap: 12px;
      margin: 10px 0;
      flex-wrap: wrap;

      mat-icon {
        color: var(--text-muted, #9ca3af);
        font-size: 18px;
        flex-shrink: 0;
      }

      .pipeline-item {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: 8px 14px;
        background: var(--bg, #f8fafc);
        border: 1px solid var(--border, #e5e7eb);
        border-radius: 6px;

        .pipeline-stage {
          font-size: 10px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          color: var(--text-muted, #9ca3af);
        }

        .pipeline-value {
          font-size: 13px;
          font-weight: 600;
          font-family: 'Roboto Mono', monospace;
          color: var(--text, #1f2937);
        }
      }
    }

    /* Reference table */
    .ref-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
      margin-top: 10px;

      th, td {
        padding: 8px 12px;
        text-align: left;
        border-bottom: 1px solid var(--border, #e5e7eb);
      }

      th {
        font-weight: 600;
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        color: var(--text-secondary, #6b7280);
        background: var(--bg, #f8fafc);
      }

      td {
        color: var(--text, #1f2937);
      }
    }

    /* Feature grid */
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 12px;
      margin-top: 12px;
    }

    .feature-item {
      display: flex;
      gap: 12px;
      padding: 14px;
      background: var(--bg, #f8fafc);
      border: 1px solid var(--border, #e5e7eb);
      border-radius: 8px;

      mat-icon {
        color: var(--primary, #0ea5e9);
        font-size: 22px;
        width: 22px;
        height: 22px;
        flex-shrink: 0;
        margin-top: 2px;
      }

      div {
        display: flex;
        flex-direction: column;
        gap: 3px;

        strong {
          font-size: 13px;
          color: var(--text, #1f2937);
        }

        span {
          font-size: 12px;
          color: var(--text-secondary, #6b7280);
          line-height: 1.5;
        }
      }
    }

    /* API endpoints */
    .api-endpoint {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      padding: 10px 0;
      border-bottom: 1px solid var(--border, #e5e7eb);

      &:last-child { border-bottom: none; }

      .api-method {
        font-size: 11px;
        font-weight: 700;
        padding: 3px 8px;
        border-radius: 4px;
        flex-shrink: 0;
        min-width: 48px;
        text-align: center;

        &.get { background: #d1fae5; color: #065f46; }
        &.post { background: #dbeafe; color: #1e40af; }
      }

      .api-details {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;

        .api-path {
          font-size: 13px;
          word-break: break-all;
        }

        .api-desc {
          font-size: 12px;
          color: var(--text-secondary, #6b7280);
        }
      }
    }

    /* FAQ */
    .faq-item {
      padding: 16px 0;
      border-bottom: 1px solid var(--border, #e5e7eb);

      &:last-child { border-bottom: none; padding-bottom: 0; }
      &:first-of-type { padding-top: 0; }

      h3 {
        margin: 0 0 6px !important;
        font-size: 14px !important;
      }

      p {
        margin: 0 !important;
      }
    }

    @media (max-width: 768px) {
      .docs-header {
        flex-direction: column;
        gap: 8px;
      }

      .tech-grid {
        grid-template-columns: 1fr;
      }

      .feature-grid {
        grid-template-columns: 1fr;
      }

      .flow-diagram {
        flex-direction: column;

        .flow-arrow {
          transform: rotate(90deg);
        }
      }

      .score-pipeline {
        flex-direction: column;
        align-items: stretch;

        mat-icon {
          transform: rotate(90deg);
          align-self: center;
        }
      }
    }
  `]
})
export class DocsComponent {
  activeSection = '';

  sections = [
    { id: 'getting-started', title: 'Getting Started', icon: 'rocket_launch' },
    { id: 'architecture', title: 'Architecture', icon: 'account_tree' },
    { id: 'generate', title: 'Generate', icon: 'dataset' },
    { id: 'process', title: 'Process', icon: 'transform' },
    { id: 'upload', title: 'Upload', icon: 'cloud_upload' },
    { id: 'reports', title: 'Reports', icon: 'assessment' },
    { id: 'analytics', title: 'Analytics', icon: 'analytics' },
    { id: 'notifications', title: 'Notifications', icon: 'notifications' },
    { id: 'shortcuts', title: 'Shortcuts', icon: 'keyboard' },
    { id: 'changelog', title: 'Changelog', icon: 'update' },
    { id: 'api', title: 'API', icon: 'api' },
    { id: 'troubleshooting', title: 'Troubleshooting', icon: 'build' }
  ];

  quickSteps = [
    { title: 'Generate Data', desc: 'Create an Excel file with synthetic student records', route: '/generate' },
    { title: 'Process Excel', desc: 'Convert Excel to CSV with a +10 score adjustment', route: '/process' },
    { title: 'Upload CSV', desc: 'Import CSV data into the PostgreSQL database (+5 adjustment)', route: '/upload' },
    { title: 'View Reports', desc: 'Search, filter, and export your student data', route: '/report' }
  ];

  apiEndpoints = [
    { method: 'POST', path: '/api/generate', desc: 'Generate Excel file with student data' },
    { method: 'POST', path: '/api/process', desc: 'Process Excel file to CSV (multipart upload)' },
    { method: 'POST', path: '/api/upload', desc: 'Upload CSV to database (multipart upload)' },
    { method: 'GET', path: '/api/students', desc: 'Get paginated students (params: page, size, search, class)' },
    { method: 'GET', path: '/api/analytics/summary', desc: 'Get analytics summary data' },
    { method: 'GET', path: '/api/students/export/{format}', desc: 'Export students as excel, csv, or pdf' },
    { method: 'GET', path: '/api/notifications', desc: 'Get all notifications' },
    { method: 'GET', path: '/api/notifications/unread-count', desc: 'Get unread notification count' },
    { method: 'POST', path: '/api/notifications/{id}/read', desc: 'Mark a notification as read' },
    { method: 'GET', path: '/api/changelog/stream', desc: 'SSE endpoint for live changelog updates' }
  ];

  faqs = [
    {
      q: 'The backend is not responding',
      a: 'Verify the Spring Boot server is running on port 9090. Check the terminal for startup errors. Ensure PostgreSQL is running and the database connection properties in application.yml are correct.'
    },
    {
      q: 'File upload fails with a large file',
      a: 'The default Spring Boot multipart max file size is configured for large files. If you hit a limit, check spring.servlet.multipart.max-file-size in application.yml. For very large datasets, ensure sufficient server memory is available.'
    },
    {
      q: 'Export PDF is empty or has no data',
      a: 'PDF export uses the current search/filter criteria. If no records match, the export will be empty. Clear the filters and try exporting again to get all records.'
    },
    {
      q: 'Notifications are not updating',
      a: 'Notifications are polled every 30 seconds. If the backend is unreachable, polling will silently fail. Check your network connection and verify the backend is running.'
    },
    {
      q: 'The generated file is not visible on the server',
      a: 'Generated files are saved to the configured output directory on the backend (typically ./output/). Ensure the directory exists and the application has write permissions.'
    },
    {
      q: 'Scores seem higher than expected',
      a: 'Scores undergo two additive transformations: +10 during Excel-to-CSV processing and +5 during CSV-to-database upload, for a total of +15 from the original generated score.'
    }
  ];

  scrollTo(id: string) {
    this.activeSection = id;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
