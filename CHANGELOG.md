# Frontend Changelog

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
