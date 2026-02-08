import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DataGenerationComponent } from './components/data-generation/data-generation.component';
import { DataProcessingComponent } from './components/data-processing/data-processing.component';
import { DataUploadComponent } from './components/data-upload/data-upload.component';
import { ReportComponent } from './components/report/report.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatTabsModule, MatToolbarModule, DataGenerationComponent, DataProcessingComponent, DataUploadComponent, ReportComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Student Data Processor';
}
