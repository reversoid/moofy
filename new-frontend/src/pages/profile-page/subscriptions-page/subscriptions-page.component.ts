import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { UserGridComponent } from '../../../widgets/user-grid/user-grid.component';
import { TuiButtonModule } from '@taiga-ui/core';
import { ProfileService } from '../../../features/profile/utils/profile.service';
import { ShortProfileListStore } from '../utils/short-profiles-list.store';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { ActivatedRoute } from '@angular/router';
import { finalize, map, switchMap, take, takeUntil } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { PaginatedData, ShortProfile } from '../../../shared/types';

@Component({
  selector: 'app-subscriptions-page',
  standalone: true,
  imports: [UserGridComponent, TuiButtonModule, AsyncPipe],
  templateUrl: './subscriptions-page.component.html',
  styleUrl: './subscriptions-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ShortProfileListStore, TuiDestroyService],
})
export class SubscriptionsPageComponent implements OnInit {
  constructor(
    private readonly profileService: ProfileService,
    private readonly profilesListStore: ShortProfileListStore,
    private readonly activatedRoute: ActivatedRoute,
    private readonly destroy$: TuiDestroyService,
  ) {}

  private profileId$ = this.activatedRoute.paramMap.pipe(map((m) => Number(m.get('id'))));

  private routeData = this.activatedRoute.data;

  title$ = this.routeData.pipe(
    map((data) =>
      (data['type'] as 'followers' | 'followees') === 'followers' ? 'Подписчики' : 'Подписки',
    ),
  );

  loading = signal(false);

  profiles$ = this.profilesListStore.profiles$.pipe(map((p) => p.items));

  loadKey$ = this.profilesListStore.profiles$.pipe(map((p) => p.nextKey));

  ngOnInit(): void {
    this.routeData.pipe(take(1), takeUntil(this.destroy$)).subscribe((data) => {
      this.profilesListStore.patchState({
        profiles: data['profiles'] as PaginatedData<ShortProfile>,
      });
    });
  }

  loadMoreProfiles(nextKey: string) {
    this.loadProfiles(nextKey).subscribe((profiles) => {
      this.profilesListStore.appendProfiles(profiles);
    });
  }

  private loadProfiles(nextKey?: string | null) {
    this.loading.set(true);
    return this.profileId$.pipe(
      takeUntil(this.destroy$),

      switchMap((id) =>
        this.profileService.getFollowers(id, nextKey).pipe(finalize(() => this.loading.set(false))),
      ),
    );
  }
}
