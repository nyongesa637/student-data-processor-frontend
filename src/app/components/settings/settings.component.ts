import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { SettingsService, AppSettings } from '../../services/settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatSlideToggleModule, MatButtonModule],
  template: `
    <div class="settings-page">
      <div class="settings-header">
        <h1>Settings</h1>
        <p>Customize the look and behavior of your application.</p>
      </div>

      <div class="settings-sections">
        <!-- Appearance -->
        <mat-card class="settings-section">
          <div class="section-header">
            <mat-icon>palette</mat-icon>
            <div>
              <h2>Appearance</h2>
              <p>Customize the visual theme and colors.</p>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-label">Dark Mode</div>
              <div class="setting-desc">Switch between light and dark interface theme.</div>
            </div>
            <mat-slide-toggle
              color="primary"
              [checked]="settings.darkMode"
              (change)="onDarkModeChange($event.checked)">
            </mat-slide-toggle>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-label">Primary Color</div>
              <div class="setting-desc">Choose the accent color used across the interface.</div>
            </div>
          </div>
          <div class="color-grid">
            <button
              *ngFor="let color of colorOptions"
              class="color-swatch"
              [class.selected]="settings.primaryColor === color.value"
              [style.background]="color.value"
              (click)="onColorChange(color.value)"
              [attr.title]="color.name">
              <mat-icon *ngIf="settings.primaryColor === color.value">check</mat-icon>
            </button>
          </div>
          <div class="current-color-label">
            Current: {{ getColorName(settings.primaryColor) }}
          </div>
        </mat-card>

        <!-- Notifications -->
        <mat-card class="settings-section">
          <div class="section-header">
            <mat-icon>notifications</mat-icon>
            <div>
              <h2>Notifications</h2>
              <p>Manage notification preferences.</p>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-label">Enable Notifications</div>
              <div class="setting-desc">Receive alerts when data operations complete (generate, process, upload).</div>
            </div>
            <mat-slide-toggle
              color="primary"
              [checked]="settings.notificationsEnabled"
              (change)="onNotificationsChange($event.checked)">
            </mat-slide-toggle>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .settings-page {
      max-width: 700px;
      margin: 0 auto;
    }

    .settings-header {
      margin-bottom: 24px;

      h1 {
        font-size: 24px;
        font-weight: 700;
        color: var(--text);
        margin: 0 0 6px;
      }

      p {
        font-size: 14px;
        color: var(--text-secondary);
        margin: 0;
      }
    }

    .settings-sections {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .settings-section {
      padding: 24px !important;
      border: 1px solid var(--border) !important;
      box-shadow: none !important;
    }

    .section-header {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);

      > mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
        color: var(--primary);
        margin-top: 2px;
      }

      h2 {
        font-size: 17px;
        font-weight: 600;
        color: var(--text);
        margin: 0 0 2px;
      }

      p {
        font-size: 13px;
        color: var(--text-secondary);
        margin: 0;
      }
    }

    .setting-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 0;
      border-bottom: 1px solid var(--border);

      &:last-child {
        border-bottom: none;
      }
    }

    .setting-info {
      flex: 1;
      min-width: 0;
    }

    .setting-label {
      font-size: 14px;
      font-weight: 500;
      color: var(--text);
      margin-bottom: 2px;
    }

    .setting-desc {
      font-size: 12px;
      color: var(--text-secondary);
      line-height: 1.4;
    }

    .color-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      padding: 12px 0 8px;
    }

    .color-swatch {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      border: 3px solid transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;

      mat-icon {
        color: white;
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      &:hover {
        transform: scale(1.1);
      }

      &.selected {
        border-color: var(--text);
        box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--text);
      }
    }

    .current-color-label {
      font-size: 12px;
      color: var(--text-muted);
      padding-bottom: 4px;
    }

    @media (max-width: 768px) {
      .settings-section {
        padding: 16px !important;
      }
    }
  `]
})
export class SettingsComponent implements OnInit, OnDestroy {
  settings: AppSettings = { darkMode: false, primaryColor: '#0ea5e9', notificationsEnabled: true };
  colorOptions: { name: string; value: string; light: string; rgb: string }[] = [];

  private sub?: Subscription;

  constructor(private settingsService: SettingsService) {
    this.colorOptions = this.settingsService.colorOptions;
  }

  ngOnInit() {
    this.sub = this.settingsService.settings$.subscribe(s => {
      this.settings = { ...s };
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  onDarkModeChange(enabled: boolean) {
    this.settingsService.setDarkMode(enabled);
  }

  onColorChange(color: string) {
    this.settingsService.setPrimaryColor(color);
  }

  onNotificationsChange(enabled: boolean) {
    this.settingsService.setNotificationsEnabled(enabled);
  }

  getColorName(value: string): string {
    return this.colorOptions.find(c => c.value === value)?.name || 'Custom';
  }
}
