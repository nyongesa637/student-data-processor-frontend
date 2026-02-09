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
  componentFilter: ChangelogFilter = 'ALL';

  navItems: NavItem[] = [
    { path: '/home', label: 'Home', icon: 'home' },
    { path: '/generate', label: 'Generate Data', icon: 'dataset' },
    { path: '/process', label: 'Process Excel', icon: 'transform' },
    { path: '/upload', label: 'Upload CSV', icon: 'cloud_upload' },
    { path: '/report', label: 'Report', icon: 'assessment' },
    { path: '/docs', label: 'Documentation', icon: 'menu_book' }
  ];

  helpItems = [
    { icon: 'home', text: 'Dashboard Overview', route: '/home' },
    { icon: 'dataset', text: 'How to Generate Data', route: '/docs' },
    { icon: 'transform', text: 'Processing Excel Files', route: '/docs' },
    { icon: 'cloud_upload', text: 'Uploading CSV Data', route: '/docs' },
    { icon: 'assessment', text: 'Viewing Reports', route: '/docs' },
    { icon: 'analytics', text: 'Analytics & Charts', route: '/docs' }
  ];

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
        if (this.isMobile) {
          this.sidenavOpen = false;
        }
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

    // Subscribe to changelog
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

    const pages: SearchResult[] = this.navItems
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

  navigateHelp(route: string) {
    this.router.navigate([route]);
    this.chatOpen = false;
  }

  onComponentFilterChange(filter: ChangelogFilter) {
    this.componentFilter = filter;
    this.changelogService.setFilter(filter);
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
