import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { finalize, map, skip, switchMap, takeUntil } from 'rxjs';
import { ExploreService } from '../../../features/explore/explore.service';
import { ShortProfile } from '../../../shared/types';
import { UserGridComponent } from '../../../widgets/user-grid/user-grid.component';
import { ExplorePageStore } from '../model/explore-page.store';

@Component({
  selector: 'app-explore-users-page',
  standalone: true,
  imports: [UserGridComponent],
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
    private readonly activatedRoute: ActivatedRoute,
  ) {}

  loading = signal(false);

  profiles = signal<ShortProfile[]>([]);

  ngOnInit(): void {
    this.setInitialProfiles();
    this.initHandleSearchChange();
  }

  private setInitialProfiles() {
    this.activatedRoute.data
      .pipe(
        map((data) => data['profiles'] as ShortProfile[]),
        takeUntil(this.destroy$),
      )
      .subscribe((profiles) => {
        this.profiles.set(profiles);
      });
  }

  private initHandleSearchChange() {
    this.explorePageStore.search$
      .pipe(
        skip(1), // skip initial value
        switchMap((search) => {
          this.loading.set(true);

          if (search) {
            return this.exploreService
              .searchProfiles(search)
              .pipe(finalize(() => this.loading.set(false)));
          }

          return this.exploreService.getTopProfiles().pipe(finalize(() => this.loading.set(false)));
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((result) => {
        this.profiles.set(result.items);
      });
  }
}
