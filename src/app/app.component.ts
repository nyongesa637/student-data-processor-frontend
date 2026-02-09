import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { NotificationService, Notification } from './services/notification.service';
import { Subscription, filter } from 'rxjs';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatToolbarModule, MatSidenavModule,
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

  navItems: NavItem[] = [
    { path: '/home', label: 'Home', icon: 'home' },
    { path: '/generate', label: 'Generate Data', icon: 'dataset' },
    { path: '/process', label: 'Process Excel', icon: 'transform' },
    { path: '/upload', label: 'Upload CSV', icon: 'cloud_upload' },
    { path: '/report', label: 'Report', icon: 'assessment' }
  ];

  private subs: Subscription[] = [];

  constructor(
    private router: Router,
    public notificationService: NotificationService
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
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  toggleSidenav() {
    this.sidenavOpen = !this.sidenavOpen;
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
      '/report': 'Report'
    };
    const title = titleMap[url] || 'Home';
    this.breadcrumbs = url === '/home' ? ['Home'] : ['Home', title];
  }
}
