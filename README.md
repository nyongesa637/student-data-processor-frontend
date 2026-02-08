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

The `run.sh` script automatically detects your OS and package manager, installs Node.js if missing, installs npm dependencies, and starts the dev server. See [Automated Setup Script](#automated-setup-script) for details.

## Manual Setup by Operating System

### Linux

#### Install Node.js 18+

**Fedora / RHEL / CentOS:**
```bash
sudo dnf install -y nodejs npm
```

**Ubuntu / Debian (via NodeSource):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Ubuntu / Debian (from default repos):**
```bash
sudo apt-get update
sudo apt-get install -y nodejs npm
```

**Arch Linux:**
```bash
sudo pacman -S nodejs npm
```

Verify installation:
```bash
node -v   # Should show v18.x or higher
npm -v    # Should show 9.x or higher
```

---

### macOS

#### Install Node.js 18+

```bash
# Using Homebrew (install from https://brew.sh if not installed)
brew install node@18
brew link --overwrite node@18
```

Verify installation:
```bash
node -v
npm -v
```

---

### Windows

#### Install Node.js 18+

**Using winget (Windows 10/11):**
```powershell
winget install --id OpenJS.NodeJS.LTS
```

**Using Chocolatey:**
```powershell
choco install nodejs-lts -y
```

**Manual install:**
Download the LTS installer from [Node.js Downloads](https://nodejs.org/en/download/) and run it. The installer includes npm.

Verify installation (open a new terminal):
```powershell
node -v
npm -v
```

---

### Install Dependencies and Run

After installing Node.js on your OS:

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npx ng serve
```

The app starts on **http://localhost:4200**. Requires the backend running on port 8080.

## Automated Setup Script

The `run.sh` script handles the full setup automatically on Linux, macOS, and Windows (Git Bash / WSL / MSYS2):

```bash
./run.sh                  # Full setup: install Node.js, npm deps, build & run
./run.sh --skip-setup     # Skip installation, validate & run only
./run.sh -s               # Short alias for --skip-setup
./run.sh --check          # Only validate environment, don't run
./run.sh --help           # Show help
```

The script:
- Detects your OS and package manager (dnf, apt, pacman, zypper, brew, winget, choco)
- Installs Node.js 18 if missing or outdated
- Runs `npm install` to install/update dependencies
- Starts the Angular dev server with `ng serve --open`

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
