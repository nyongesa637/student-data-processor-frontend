import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterModule, MatIconModule, MatButtonModule],
  template: `
    <div class="error-page">
      <div class="error-content">
        <div class="error-code">404</div>
        <div class="error-icon">
          <mat-icon>search_off</mat-icon>
        </div>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <div class="error-actions">
          <a mat-raised-button class="primary-btn" routerLink="/home">
            <mat-icon>home</mat-icon> Go to Home
          </a>
          <a mat-stroked-button routerLink="/docs">
            <mat-icon>menu_book</mat-icon> Documentation
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .error-page {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 200px);
      padding: 24px;
    }

    .error-content {
      text-align: center;
      max-width: 480px;
    }

    .error-code {
      font-size: 96px;
      font-weight: 800;
      color: var(--primary);
      line-height: 1;
      margin-bottom: 8px;
      opacity: 0.8;
    }

    .error-icon {
      margin-bottom: 16px;

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: var(--text-muted);
      }
    }

    h1 {
      font-size: 24px;
      font-weight: 700;
      color: var(--text);
      margin: 0 0 8px;
    }

    p {
      font-size: 15px;
      color: var(--text-secondary);
      margin: 0 0 32px;
      line-height: 1.6;
    }

    .error-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;

      .primary-btn {
        background: var(--primary) !important;
        color: white !important;
        box-shadow: none !important;
      }

      a {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        text-decoration: none;
      }
    }
  `]
})
export class NotFoundComponent {}
