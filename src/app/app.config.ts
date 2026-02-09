import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { DataGenerationComponent } from './components/data-generation/data-generation.component';
import { DataProcessingComponent } from './components/data-processing/data-processing.component';
import { DataUploadComponent } from './components/data-upload/data-upload.component';
import { ReportComponent } from './components/report/report.component';
import { DocsComponent } from './components/docs/docs.component';
import { SettingsComponent } from './components/settings/settings.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ErrorComponent } from './components/error/error.component';
import { provideServiceWorker } from '@angular/service-worker';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, data: { title: 'Home' } },
  { path: 'generate', component: DataGenerationComponent, data: { title: 'Generate Data' } },
  { path: 'process', component: DataProcessingComponent, data: { title: 'Process Excel' } },
  { path: 'upload', component: DataUploadComponent, data: { title: 'Upload CSV' } },
  { path: 'report', component: ReportComponent, data: { title: 'Report' } },
  { path: 'docs', component: DocsComponent, data: { title: 'Documentation' } },
  { path: 'settings', component: SettingsComponent, data: { title: 'Settings' } },
  { path: 'error', component: ErrorComponent, data: { title: 'Error' } },
  { path: '**', component: NotFoundComponent, data: { title: 'Page Not Found' } }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideRouter(routes), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          })
  ]
};
