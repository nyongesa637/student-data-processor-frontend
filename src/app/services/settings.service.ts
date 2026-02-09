import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppSettings {
  darkMode: boolean;
  primaryColor: string;
  notificationsEnabled: boolean;
}

export interface ColorOption {
  name: string;
  value: string;
  light: string;
  rgb: string;
}

const COLOR_OPTIONS: ColorOption[] = [
  { name: 'Sky Blue', value: '#0ea5e9', light: '#e0f2fe', rgb: '14, 165, 233' },
  { name: 'Indigo', value: '#6366f1', light: '#e0e7ff', rgb: '99, 102, 241' },
  { name: 'Emerald', value: '#10b981', light: '#d1fae5', rgb: '16, 185, 129' },
  { name: 'Rose', value: '#f43f5e', light: '#ffe4e6', rgb: '244, 63, 94' },
  { name: 'Amber', value: '#f59e0b', light: '#fef3c7', rgb: '245, 158, 11' },
  { name: 'Violet', value: '#8b5cf6', light: '#ede9fe', rgb: '139, 92, 246' },
  { name: 'Teal', value: '#14b8a6', light: '#ccfbf1', rgb: '20, 184, 166' },
  { name: 'Orange', value: '#f97316', light: '#ffedd5', rgb: '249, 115, 22' }
];

const STORAGE_KEY = 'sdp-settings';

const DEFAULTS: AppSettings = {
  darkMode: false,
  primaryColor: '#0ea5e9',
  notificationsEnabled: true
};

@Injectable({ providedIn: 'root' })
export class SettingsService {
  readonly colorOptions = COLOR_OPTIONS;

  private settings: AppSettings;
  settings$ = new BehaviorSubject<AppSettings>(DEFAULTS);

  constructor() {
    this.settings = this.load();
    this.settings$.next(this.settings);
    this.applyTheme();
  }

  get current(): AppSettings {
    return this.settings;
  }

  setDarkMode(enabled: boolean) {
    this.settings.darkMode = enabled;
    this.save();
    this.applyTheme();
  }

  setPrimaryColor(color: string) {
    this.settings.primaryColor = color;
    this.save();
    this.applyTheme();
  }

  setNotificationsEnabled(enabled: boolean) {
    this.settings.notificationsEnabled = enabled;
    this.save();
  }

  private load(): AppSettings {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...DEFAULTS, ...parsed };
      }
    } catch {}
    return { ...DEFAULTS };
  }

  private save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    this.settings$.next({ ...this.settings });
  }

  applyTheme() {
    const root = document.documentElement;
    const colorOpt = COLOR_OPTIONS.find(c => c.value === this.settings.primaryColor) || COLOR_OPTIONS[0];

    root.style.setProperty('--primary', colorOpt.value);
    root.style.setProperty('--primary-light', colorOpt.light);
    root.style.setProperty('--primary-rgb', colorOpt.rgb);

    if (this.settings.darkMode) {
      root.style.setProperty('--border', '#374151');
      root.style.setProperty('--text', '#f3f4f6');
      root.style.setProperty('--text-secondary', '#d1d5db');
      root.style.setProperty('--text-muted', '#9ca3af');
      root.style.setProperty('--bg', '#111827');
      root.style.setProperty('--surface', '#1f2937');
      root.classList.add('dark-mode');
    } else {
      root.style.setProperty('--border', '#e5e7eb');
      root.style.setProperty('--text', '#1f2937');
      root.style.setProperty('--text-secondary', '#6b7280');
      root.style.setProperty('--text-muted', '#9ca3af');
      root.style.setProperty('--bg', '#f8fafc');
      root.style.setProperty('--surface', '#ffffff');
      root.classList.remove('dark-mode');
    }
  }
}
