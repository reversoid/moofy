import { Injectable, OnDestroy, computed, signal } from '@angular/core';
import { TuiBreakpointService } from '@taiga-ui/core';
import { Subject, filter, takeUntil } from 'rxjs';

export type CollectionsView = 'list' | 'grid';

@Injectable()
export class CollectionGridService implements OnDestroy {
  constructor(private readonly breakpointService: TuiBreakpointService) {
    this.initializeGridOnMobile();
  }

  private _collectionsView = signal<CollectionsView>('grid');

  private readonly destroy$ = new Subject<void>();

  collectionsView = this._collectionsView.asReadonly();

  collectionsViewIcon = computed(() => this.iconViewMap[this._collectionsView()]);

  toggleCollectionsView() {
    this._collectionsView.set(this.toggleViewMap[this._collectionsView()]);
  }

  private readonly toggleViewMap: Record<CollectionsView, CollectionsView> = {
    grid: 'list',
    list: 'grid',
  };

  private readonly iconViewMap: Record<CollectionsView, string> = {
    grid: 'tuiIconGridLarge',
    list: 'tuiIconListLarge',
  };

  private initializeGridOnMobile() {
    this.breakpointService
      .pipe(
        filter((e) => e === 'mobile'),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this._collectionsView.set('grid');
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
