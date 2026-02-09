import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { BreakpointObserver } from '@angular/cdk/layout';
import { NotificationService, Notification } from './services/notification.service';
import { ApiService } from './services/api.service';
import { ChangelogService, ChangelogEntry, ChangelogFilter } from './services/changelog.service';
import { Subscription, filter, Subject, debounceTime, switchMap, of } from 'rxjs';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

interface SearchResult {
  group: string;
  icon: string;
  text: string;
  sub?: string;
  route?: string;
}

interface ChatMessage {
  type: 'user' | 'system';
  text: string;
  link?: string;
  linkLabel?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterModule, MatToolbarModule, MatSidenavModule,
    MatListModule, MatIconModule, MatButtonModule, MatBadgeModule, MatMenuModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Student Data Processor';
  sidenavOpen = true;
  breadcrumbs: string[] = ['Home'];
  unreadCount = 0;
  notifications: Notification[] = [];
  isMobile = false;

  // Search
  searchQuery = '';
  searchResults: SearchResult[] = [];
  showSearchDropdown = false;
  private searchSubject = new Subject<string>();

  // Chat
  chatOpen = false;
  chatTab: 'changelog' | 'help' = 'changelog';
  changelog: ChangelogEntry[] = [];
  changelogCount = 0;
  componentFilter: ChangelogFilter = 'FRONTEND';
  selectedChangelog: ChangelogEntry | null = null;

  // Help chat
  helpInput = '';
  showCommandList = false;
  chatMessages: ChatMessage[] = [
    { type: 'system', text: 'Welcome! Type / to see available commands.' }
  ];

  helpCommands = [
    { cmd: '/dashboard', desc: 'Go to dashboard overview', route: '/home', response: 'Here\'s the dashboard where you can see analytics and workflow overview.' },
    { cmd: '/generate', desc: 'How to generate data', route: '/generate', response: 'Navigate to the Generate Data page to create Excel files with student records.' },
    { cmd: '/process', desc: 'How to process Excel files', route: '/process', response: 'Navigate to the Process Excel page to convert Excel files to CSV format.' },
    { cmd: '/upload', desc: 'How to upload CSV data', route: '/upload', response: 'Navigate to the Upload CSV page to import data into the database.' },
    { cmd: '/report', desc: 'How to view reports', route: '/report', response: 'Navigate to the Report page to view, search, filter, and export student data.' },
    { cmd: '/docs', desc: 'View full documentation', route: '/docs', response: 'Visit the documentation page for comprehensive guides on all features.' }
  ];

  navItems: NavItem[] = [
    { path: '/home', label: 'Home', icon: 'home' },
    { path: '/generate', label: 'Generate Data', icon: 'dataset' },
    { path: '/process', label: 'Process Excel', icon: 'transform' },
    { path: '/upload', label: 'Upload CSV', icon: 'cloud_upload' },
    { path: '/report', label: 'Report', icon: 'assessment' }
  ];

  docsNavItem: NavItem = { path: '/docs', label: 'Documentation', icon: 'menu_book' };

  @ViewChild('searchInput') searchInput!: ElementRef;

  private subs: Subscription[] = [];

  constructor(
    private router: Router,
    public notificationService: NotificationService,
    private api: ApiService,
    private breakpointObserver: BreakpointObserver,
    private changelogService: ChangelogService
  ) {}

  ngOnInit() {
    this.subs.push(
      this.router.events.pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd)
      ).subscribe((event) => {
        this.updateBreadcrumbs(event.urlAfterRedirects);
      })
    );

    this.subs.push(
      this.notificationService.unreadCount$.subscribe(count => this.unreadCount = count)
    );
    this.subs.push(
      this.notificationService.notifications$.subscribe(n => this.notifications = n)
    );

    // Responsive
    this.subs.push(
      this.breakpointObserver.observe(['(max-width: 768px)']).subscribe(result => {
        this.isMobile = result.matches;
        this.sidenavOpen = !this.isMobile;
      })
    );

    // Search debounce
    this.subs.push(
      this.searchSubject.pipe(
        debounceTime(300),
        switchMap(query => {
          if (!query || query.length < 2) return of([]);
          return this.api.getStudents(0, 5, query);
        })
      ).subscribe((res: any) => {
        const studentResults: SearchResult[] = (res?.content || []).map((s: any) => ({
          group: 'Students',
          icon: 'person',
          text: `${s.firstName} ${s.lastName}`,
          sub: s.studentId,
          route: '/report'
        }));
        this.buildSearchResults(studentResults);
      })
    );

    // Subscribe to changelog - default to frontend only
    this.changelogService.setFilter('FRONTEND');
    this.subs.push(
      this.changelogService.filteredEntries$.subscribe(entries => {
        this.changelog = entries;
        this.changelogCount = entries.length;
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.global-search')) {
      this.showSearchDropdown = false;
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      this.searchInput?.nativeElement?.focus();
    }
  }

  toggleSidenav() {
    this.sidenavOpen = !this.sidenavOpen;
  }

  onSearchInput() {
    const q = this.searchQuery.trim();
    if (q.length < 2) {
      this.buildSearchResults([]);
      return;
    }
    this.searchSubject.next(q);
    this.showSearchDropdown = true;
    // Build page/action results immediately
    this.buildSearchResults([]);
  }

  onSearchFocus() {
    if (this.searchQuery.trim().length >= 2) {
      this.showSearchDropdown = true;
    }
  }

  private buildSearchResults(studentResults: SearchResult[]) {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) {
      this.searchResults = [];
      return;
    }

    const allNav = [...this.navItems, this.docsNavItem];
    const pages: SearchResult[] = allNav
      .filter(n => n.label.toLowerCase().includes(q))
      .map(n => ({ group: 'Pages', icon: n.icon, text: n.label, route: n.path }));

    const actions: SearchResult[] = [];
    if ('generate data'.includes(q) || 'create excel'.includes(q)) {
      actions.push({ group: 'Actions', icon: 'play_arrow', text: 'Generate Data', sub: 'Create Excel file', route: '/generate' });
    }
    if ('process excel'.includes(q) || 'convert csv'.includes(q)) {
      actions.push({ group: 'Actions', icon: 'play_arrow', text: 'Process Excel', sub: 'Convert to CSV', route: '/process' });
    }
    if ('upload csv'.includes(q) || 'upload database'.includes(q)) {
      actions.push({ group: 'Actions', icon: 'play_arrow', text: 'Upload CSV', sub: 'Store in database', route: '/upload' });
    }
    if ('export'.includes(q) || 'download'.includes(q)) {
      actions.push({ group: 'Actions', icon: 'download', text: 'Export Data', sub: 'Excel, CSV, or PDF', route: '/report' });
    }

    this.searchResults = [...pages, ...actions, ...studentResults];
    this.showSearchDropdown = this.searchResults.length > 0 || q.length >= 2;
  }

  getGroupResults(group: string): SearchResult[] {
    return this.searchResults.filter(r => r.group === group);
  }

  onSearchResultClick(result: SearchResult) {
    this.showSearchDropdown = false;
    this.searchQuery = '';
    if (result.route) {
      this.router.navigate([result.route]);
    }
  }

  toggleChat() {
    this.chatOpen = !this.chatOpen;
  }

  // Help chat command system
  onHelpInput() {
    if (this.helpInput === '/') {
      this.showCommandList = true;
      return;
    }
    if (this.helpInput.startsWith('/')) {
      this.showCommandList = true;
    } else {
      this.showCommandList = false;
    }
  }

  onHelpKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.helpInput.trim()) {
      this.executeCommand(this.helpInput.trim());
    }
  }

  executeCommand(cmd: string) {
    this.chatMessages.push({ type: 'user', text: cmd });
    this.showCommandList = false;

    const match = this.helpCommands.find(c => c.cmd === cmd);
    if (match) {
      this.chatMessages.push({
        type: 'system',
        text: match.response,
        link: match.route,
        linkLabel: `Go to ${match.desc}`
      });
    } else {
      this.chatMessages.push({
        type: 'system',
        text: 'Unknown command. Type / to see available commands.'
      });
    }
    this.helpInput = '';
  }

  selectCommand(cmd: string) {
    this.executeCommand(cmd);
  }

  navigateFromChat(route: string) {
    this.router.navigate([route]);
    this.chatOpen = false;
  }

  onComponentFilterChange(f: ChangelogFilter) {
    this.componentFilter = f;
    this.changelogService.setFilter(f);
  }

  formatChangelogDate(dateStr: string): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  markAllRead() {
    this.notificationService.markAllAsRead();
  }

  markRead(n: Notification) {
    if (!n.read) {
      this.notificationService.markAsRead(n.id);
    }
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'GENERATION': return 'dataset';
      case 'PROCESSING': return 'transform';
      case 'UPLOAD': return 'cloud_upload';
      default: return 'notifications';
    }
  }

  formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }

  private updateBreadcrumbs(url: string) {
    const titleMap: Record<string, string> = {
      '/home': 'Home',
      '/generate': 'Generate Data',
      '/process': 'Process Excel',
      '/upload': 'Upload CSV',
      '/report': 'Report',
      '/docs': 'Documentation'
    };
    const title = titleMap[url] || 'Home';
    this.breadcrumbs = url === '/home' ? ['Home'] : ['Home', title];
  }
}
