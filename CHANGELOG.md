# Frontend Changelog

## [4.0.0] - 2026-02-09

### Added
- Global search now includes student records (searches pages, actions, and students)
- Ctrl+K keyboard shortcut to focus global search bar, shortcut badge shown in input
- Chat-based help system with `/` commands (type `/` to see available commands)
- Right-side preview panel on Generate, Process, and Upload pages showing records in editor-style table (first 15 rows)
- File summary section displayed below action cards after operations complete
- Individual mesh canvas animation per action card on home page

### Changed
- Search bar now spans the full center of the header (flex: 1) instead of fixed width
- Sidebar collapse icon changed to `view_sidebar` (rounded rectangle with 1/4-3/4 split)
- Documentation moved to the bottom of the sidebar
- Changelog panel now shows only frontend updates in email-style layout (not list format)
- Removed changelog filter buttons (All/Frontend/Backend) - defaults to frontend only
- Home page action cards: Get Started has sky blue overlay + mesh, Request Feature has mesh only with neutral button
- Upload/Process/Generate action buttons now use sky blue (#0ea5e9) background
- Removed all box shadows from Generate, Process, and Upload cards and buttons (outline only)
- Preview panel redesigned from inline banner to right-side editor-style record viewer

### Removed
- "Top Classes by Student Count" section from home page analytics
- Backend changelog entries from the chat panel
- Help items list replaced with interactive chat command system

### Fixed
- Sidenav collapse gap: no more space between body and collapsed sidenav
- Sidebar no longer has horizontal or vertical scrolling

## [3.0.0] - 2026-02-09

### Added
- ChangelogService with SSE EventSource for real-time updates
- Changelog filter buttons (All / Frontend / Backend) in chat panel
- Component badges on changelog entries
- NgZone-aware SSE event handling

### Fixed
- Chat panel field bindings (`entry.date` → `entry.releaseDate`, `entry.description` → `entry.changes`)

## [2.0.0] - 2026-02-09

### Added
- Sidenav-based navigation with collapsible sidebar
- Home dashboard with analytics summary and workflow timeline
- Interactive action cards with cursor-reactive mesh gradient effects
- Feature request submission dialog
- Toast notifications for all actions
- Notification bell with unread badge and dropdown panel
- Breadcrumb navigation in header
- Global search with student, page, and action results
- Chat panel with changelog and help tabs

### Changed
- Migrated from tab-based to router-based navigation architecture
- Redesigned UI with dark sidenav and modern card-based layout
- Added Material Icons to all action buttons and navigation items

### Fixed
- Class filter now fetches actual class names from API
- Success messages display actual filenames and record counts

## [1.0.0] - 2026-01-01

### Added
- Initial Angular frontend
- Excel data generation form
- Excel to CSV processing with file upload
- CSV to database upload
- Student report with pagination, search, and filtering
- Export to Excel, CSV, and PDF formats
