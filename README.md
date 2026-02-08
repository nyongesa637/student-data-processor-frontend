# Student Data Processor - Frontend

Angular 18 UI for student data generation, Excel/CSV processing, database upload, and reporting with pagination, search, filtering, and multi-format export.

## Tech Stack

- **Angular 18** (standalone components, no NgModules)
- **Angular Material** with Indigo-Pink theme
- **TypeScript 5.5**
- **SCSS** for styling
- **RxJS** for reactive API communication

## Prerequisites

| Tool    | Version | Purpose                |
|---------|---------|------------------------|
| Node.js | 18.19+  | JavaScript runtime     |
| npm     | 9+      | Package manager        |

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/nyongesa637/student-data-processor-frontend.git
cd student-data-processor-frontend

# 2. Run the setup script (installs Node.js if missing, installs deps, builds & runs)
chmod +x run.sh
./run.sh

# OR if you already have everything installed:
./run.sh --skip-setup
```

## Manual Setup

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npx ng serve
```

The app starts on **http://localhost:4200**. Requires the backend running on port 8080.

## Features

### Tab 1: Generate Data
- Enter the number of student records to generate (up to 1,000,000)
- Generates an Excel file on the server at `/var/log/applications/API/dataprocessing/`
- Displays progress bar during generation and confirms with the output filename

### Tab 2: Process Excel to CSV
- Upload a generated `.xlsx` file
- Converts to CSV format with each student's score increased by 10
- Output CSV saved to the server's output directory

### Tab 3: Upload CSV to Database
- Upload a processed `.csv` file
- Records are inserted into PostgreSQL with each score increased by 5
- Uses batch insertion (1000 per batch) for performance with large datasets
- Displays the number of records inserted upon completion

### Tab 4: Report
- **Paginated table** with server-side pagination (10, 25, 50, or 100 rows per page)
- **Search** by Student ID (press Enter or click Search)
- **Filter** by Class using dropdown (A through J)
- **Export** filtered data in three formats:
  - Excel (.xlsx)
  - CSV (.csv)
  - PDF (.pdf)

## Project Structure

```
src/
├── main.ts                                    # Application bootstrap
├── index.html                                 # Entry HTML with Material fonts
├── styles.scss                                # Global styles (Material theme)
└── app/
    ├── app.config.ts                          # Providers (animations, HttpClient)
    ├── app.component.ts                       # Root component with tab navigation
    ├── app.component.html                     # Material toolbar + tab group
    ├── app.component.scss                     # Toolbar styles
    ├── services/
    │   └── api.service.ts                     # HTTP client for all backend APIs
    └── components/
        ├── data-generation/
        │   └── data-generation.component.ts   # Record count input + generate button
        ├── data-processing/
        │   └── data-processing.component.ts   # Excel file picker + process button
        ├── data-upload/
        │   └── data-upload.component.ts       # CSV file picker + upload button
        └── report/
            └── report.component.ts            # Material table + pagination + search + export
```

## API Integration

All API calls go through `ApiService` (`src/app/services/api.service.ts`), connecting to `http://localhost:8080/api`:

| Method | Endpoint | Component | Action |
|--------|----------|-----------|--------|
| `POST` | `/api/generate?count=N` | DataGeneration | Generate Excel |
| `POST` | `/api/process` | DataProcessing | Upload Excel, get CSV |
| `POST` | `/api/upload` | DataUpload | Upload CSV to database |
| `GET`  | `/api/students` | Report | Paginated student list |
| `GET`  | `/api/students/export/excel` | Report | Download Excel export |
| `GET`  | `/api/students/export/csv` | Report | Download CSV export |
| `GET`  | `/api/students/export/pdf` | Report | Download PDF export |

## Component Architecture

All components are **standalone** (Angular 18 pattern - no NgModules required):

```
AppComponent (tab navigation)
├── DataGenerationComponent    → ApiService.generateData()
├── DataProcessingComponent    → ApiService.processFile()
├── DataUploadComponent        → ApiService.uploadFile()
└── ReportComponent            → ApiService.getStudents() + exports
```

Each component:
- Manages its own Material imports
- Shows loading progress bar during API calls
- Displays success/error messages inline

## Configuration

To change the backend URL, edit `src/app/services/api.service.ts`:

```typescript
private baseUrl = 'http://localhost:8080/api'; // Change this
```

## Build

```bash
# Development build
npx ng build

# Production build
npx ng build --configuration production
```

Output is written to `dist/student-data-processor-frontend/`.

## Testing Workflow

1. Start the backend (`mvn spring-boot:run` in the backend project)
2. Start the frontend (`npx ng serve`)
3. Open `http://localhost:4200`
4. **Tab 1**: Enter `1000`, click Generate Excel
5. **Tab 2**: Upload the generated Excel file, click Process
6. **Tab 3**: Upload the output CSV file, click Upload to Database
7. **Tab 4**: Browse the paginated report, search by ID, filter by class, export

## Related

- **Backend**: [student-data-processor-backend](https://github.com/nyongesa637/student-data-processor-backend)
