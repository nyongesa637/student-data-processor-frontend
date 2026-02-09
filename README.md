# Student Data Processor - Frontend

Angular 18 UI for student data generation, Excel/CSV processing, database upload, and reporting with pagination, search, filtering, and multi-format export.

## Tech Stack

- **Angular 18** (standalone components, no NgModules)
- **Angular Material 18.2** with custom sky blue theme
- **TypeScript 5.5** (strict mode)
- **SCSS** for styling
- **RxJS 7.8** for reactive API communication

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

```bash
brew install node@18
brew link --overwrite node@18
```

---

### Windows

**Using winget (Windows 10/11):**
```powershell
winget install --id OpenJS.NodeJS.LTS
```

**Using Chocolatey:**
```powershell
choco install nodejs-lts -y
```

**Manual install:**
Download the LTS installer from [Node.js Downloads](https://nodejs.org/en/download/) and run it.

---

### Install Dependencies and Run

```bash
npm install
npx ng serve
```

The app starts on **http://localhost:4200**. Requires the backend running on port 9090.

## Automated Setup Script

```bash
./run.sh                  # Full setup: install Node.js, npm deps, build & run
./run.sh --skip-setup     # Skip installation, validate & run only
./run.sh -s               # Short alias for --skip-setup
./run.sh --check          # Only validate environment, don't run
./run.sh --help           # Show help
```

## Features

### Navigation & Layout
- **Collapsible sidebar** with smooth transitions (240px expanded, 64px collapsed)
- **Documentation** pinned to sidebar bottom
- **Breadcrumb navigation** with route-aware updates
- **Mobile bottom navigation** for screens under 768px
- **No sidebar scrolling** - all items fit without overflow

### Global Search (Ctrl+K)
- Press **Ctrl+K** to focus the search bar (shortcut badge displayed in input)
- Searches across **pages**, **actions**, and **student records**
- Debounced API search (300ms) with grouped dropdown results
- Search bar spans the full center of the header

### Home Dashboard
- **Action cards** with interactive mesh animation:
  - **Get Started**: Sky blue overlay + mesh, primary CTA
  - **Request Feature**: Mesh only (sky blue lines/nodes), neutral button
- **Workflow timeline** with 4 clickable steps
- **Analytics summary**: Total students, average/highest/lowest scores
- **Recent records** table with link to full report

### Generate Data
- Input record count (up to 1,000,000)
- Generates Excel file on server
- **Right-side preview**: Editor-style table showing first 15 records
- **Summary below card**: Filename, record count, format, status

### Process Excel to CSV
- Upload `.xlsx` file for conversion
- Score increased by 10
- **Right-side preview**: Shows sample CSV records in editor table
- **Summary below card**: Output file, format, transformation, status

### Upload CSV to Database
- Upload `.csv` file to PostgreSQL
- Score increased by 5, batch insertion (1000/batch)
- **Right-side preview**: Shows actual database records (first 15)
- **Summary below card**: Record count, destination, transformation, status

### Report
- Paginated table (10, 25, 50, 100 rows)
- Search by Student ID
- Filter by Class
- Export: Excel, CSV, PDF

### Help & Updates (Chat Panel)
- **Help tab**: Chat-style interface with `/` commands
  - Type `/` to see available commands
  - Commands return responses with navigation links
- **Changelog tab**: Frontend-only updates in email notification style

### Notifications
- Real-time notification bell with unread badge
- Polls backend every 30 seconds
- Mark individual or all as read

## Project Structure

```
src/
├── main.ts
├── index.html
├── styles.scss                                # Global design system
└── app/
    ├── app.config.ts                          # Routes & providers
    ├── app.component.ts                       # Shell: sidenav, header, search, chat
    ├── app.component.html                     # Layout template
    ├── app.component.scss                     # Layout styles
    ├── services/
    │   ├── api.service.ts                     # HTTP client for all APIs
    │   ├── notification.service.ts            # Notification polling
    │   ├── changelog.service.ts               # Changelog with SSE
    │   └── toast.service.ts                   # Snackbar notifications
    └── components/
        ├── home/
        │   └── home.component.ts              # Dashboard with mesh cards
        ├── data-generation/
        │   └── data-generation.component.ts   # Generate + preview
        ├── data-processing/
        │   └── data-processing.component.ts   # Process + preview
        ├── data-upload/
        │   └── data-upload.component.ts       # Upload + preview
        ├── report/
        │   └── report.component.ts            # Table + pagination + export
        └── docs/
            └── docs.component.ts              # Documentation
```

## API Integration

All API calls go through `ApiService` at `http://localhost:9090/api`:

| Method | Endpoint | Component | Action |
|--------|----------|-----------|--------|
| `POST` | `/api/generate?count=N` | DataGeneration | Generate Excel |
| `POST` | `/api/process` | DataProcessing | Upload Excel, get CSV |
| `POST` | `/api/upload` | DataUpload | Upload CSV to database |
| `GET`  | `/api/students` | Report / Search | Paginated student list |
| `GET`  | `/api/students/classes` | Report | List distinct classes |
| `GET`  | `/api/students/export/excel` | Report | Download Excel export |
| `GET`  | `/api/students/export/csv` | Report | Download CSV export |
| `GET`  | `/api/students/export/pdf` | Report | Download PDF export |
| `GET`  | `/api/analytics/summary` | Home | Dashboard analytics |
| `GET`  | `/api/notifications` | App | Notification list |
| `GET`  | `/api/changelog` | App | Changelog entries |

## Design System

| Variable | Value | Usage |
|----------|-------|-------|
| `--primary` | `#0ea5e9` | Sky blue - buttons, links, accents |
| `--primary-light` | `#e0f2fe` | Light blue - hover states, badges |
| `--border` | `#e5e7eb` | Card and input borders |
| `--text` | `#1f2937` | Primary text |
| `--text-secondary` | `#6b7280` | Secondary text |
| `--bg` | `#f8fafc` | Page background |
| `--surface` | `#ffffff` | Card/panel background |

## Build

```bash
npx ng build                           # Development build
npx ng build --configuration production # Production build
```

Output: `dist/student-data-processor-frontend/`

## Testing Workflow

1. Start the backend (`mvn spring-boot:run` in the backend project)
2. Start the frontend (`npx ng serve`)
3. Open `http://localhost:4200`
4. **Generate**: Enter `1000`, click Generate Excel, see preview on right
5. **Process**: Upload the generated Excel file, click Process, see preview
6. **Upload**: Upload the output CSV file, click Upload, see database records
7. **Report**: Browse paginated report, search, filter, export

## Related

- **Backend**: [student-data-processor-backend](https://github.com/nyongesa637/student-data-processor-backend)
