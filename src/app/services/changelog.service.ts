import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from './api.service';

export interface ChangelogEntry {
  id: number;
  version: string;
  releaseDate: string;
  changes: string;
  component: string;
}

export type ChangelogFilter = 'ALL' | 'FRONTEND' | 'BACKEND';

@Injectable({ providedIn: 'root' })
export class ChangelogService implements OnDestroy {
  private entries$ = new BehaviorSubject<ChangelogEntry[]>([]);
  private filter$ = new BehaviorSubject<ChangelogFilter>('ALL');
  filteredEntries$ = new BehaviorSubject<ChangelogEntry[]>([]);

  private eventSource: EventSource | null = null;

  constructor(private api: ApiService, private ngZone: NgZone) {
    this.loadEntries();
    this.connectSSE();

    this.entries$.subscribe(() => this.applyFilter());
    this.filter$.subscribe(() => this.applyFilter());
  }

  ngOnDestroy() {
    this.eventSource?.close();
  }

  get currentFilter(): ChangelogFilter {
    return this.filter$.value;
  }

  setFilter(filter: ChangelogFilter) {
    this.filter$.next(filter);
  }

  private loadEntries() {
    this.api.getChangelog().subscribe({
      next: (data) => this.entries$.next(data || []),
      error: () => {}
    });
  }

  private connectSSE() {
    this.eventSource = new EventSource('http://localhost:9090/api/changelog/stream');
    this.eventSource.addEventListener('changelog-update', (event: MessageEvent) => {
      this.ngZone.run(() => {
        const entry: ChangelogEntry = JSON.parse(event.data);
        const current = this.entries$.value;
        this.entries$.next([entry, ...current]);
      });
    });
    this.eventSource.onerror = () => {
      // Connection lost - will auto-reconnect via EventSource spec
    };
  }

  private applyFilter() {
    const entries = this.entries$.value;
    const filter = this.filter$.value;
    if (filter === 'ALL') {
      this.filteredEntries$.next(entries);
    } else {
      this.filteredEntries$.next(
        entries.filter(e => e.component === filter || e.component === 'GENERAL')
      );
    }
  }
}
