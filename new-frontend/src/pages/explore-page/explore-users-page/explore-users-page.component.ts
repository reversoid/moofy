import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { UserGridComponent } from '../../../widgets/user-grid/user-grid.component';
import { ExplorePageStore } from '../model/explore-page.store';
import { combineLatest, combineLatestWith, finalize, map, switchMap, takeUntil } from 'rxjs';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { ExploreService } from '../../../features/explore/explore.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-explore-users-page',
  standalone: true,
  imports: [UserGridComponent, AsyncPipe],
  templateUrl: './explore-users-page.component.html',
  styleUrl: './explore-users-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class ExploreUsersPageComponent implements OnInit {
  constructor(
    private readonly explorePageStore: ExplorePageStore,
    private readonly destroy$: TuiDestroyService,
    private readonly exploreService: ExploreService,
  ) {}

  profiles$ = combineLatest([this.explorePageStore.profiles$, this.explorePageStore.search$]).pipe(
    map(([profiles, search]) => {
      if (profiles?.search === search) {
        return profiles.items;
      }
      return null;
    }),
  );

  ngOnInit(): void {
    this.initHandleSearchChange();
  }

  loading = signal(false);

  private initHandleSearchChange() {
    this.explorePageStore.search$
      .pipe(
        switchMap((search) => {
          this.loading.set(true);

          if (search) {
            return this.exploreService
              .searchProfiles(search)
              .pipe(finalize(() => this.loading.set(false)));
          }

          return this.exploreService.getTopProfiles().pipe(finalize(() => this.loading.set(false)));
        }),
        combineLatestWith(this.explorePageStore.search$),
        takeUntil(this.destroy$),
      )
      .subscribe(([result, search]) => {
        this.explorePageStore.setProfiles({ search, items: result.items });
      });
  }
}
