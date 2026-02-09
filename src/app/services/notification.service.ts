import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';

export interface Notification {
  id: number;
  type: string;
  message: string;
  details: string;
  read: boolean;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  notifications$ = new BehaviorSubject<Notification[]>([]);
  unreadCount$ = new BehaviorSubject<number>(0);

  private pollInterval: any;
  private enabled = true;

  constructor(private api: ApiService) {
    this.refresh();
    this.startPolling();
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.notifications$.next([]);
      this.unreadCount$.next(0);
    } else {
      this.refresh();
    }
  }

  refresh() {
    if (!this.enabled) return;
    this.api.getNotifications().subscribe({
      next: (data) => this.notifications$.next(data),
      error: () => {}
    });
    this.api.getUnreadNotificationCount().subscribe({
      next: (count) => this.unreadCount$.next(count),
      error: () => {}
    });
  }

  markAsRead(id: number) {
    this.api.markNotificationRead(id).subscribe(() => this.refresh());
  }

  markAllAsRead() {
    this.api.markAllNotificationsRead().subscribe(() => this.refresh());
  }

  private startPolling() {
    this.pollInterval = setInterval(() => this.refresh(), 30000);
  }
}
