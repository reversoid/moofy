import { AsyncPipe, NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ActivatedRoute, Data, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import dayjs from 'dayjs';
import { combineLatest, finalize, map, switchMap, take, takeUntil, tap } from 'rxjs';
import { AppState } from '../../app/store';
import { selectCurrentUser } from '../../entities/current-user/selectors';
import { ProfileService } from '../../features/profile/utils/profile.service';
import { Profile } from '../../shared/types';
import { CollectionGridComponent } from '../../widgets/collection-grid/collection-grid.component';
import { ProfilePageStore } from './utils/profile-page.store';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    TuiIslandModule,
    NgOptimizedImage,
    RouterModule,
    CollectionGridComponent,
    TuiButtonModule,
    AsyncPipe,
    NgIf,
    TuiLoaderModule,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, ProfilePageStore],
})
export class ProfilePageComponent {
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly profileService: ProfileService,
    private readonly destroy$: TuiDestroyService,
    private readonly store: Store<AppState>,
    private readonly profilePageStore: ProfilePageStore,
  ) {
    this.initProfileStore();
  }

  private initProfileStore() {
    this.activatedRoute.data
      .pipe(
        map<Data, Profile>((data) => data['profile']),
        takeUntil(this.destroy$),
      )
      .subscribe((profile) => {
        this.profilePageStore.setState({ profile });
      });
  }

  profile$ = this.profilePageStore.profile$;

  username$ = this.profile$.pipe(map((p) => p.user.username));

  description$ = this.profile$.pipe(map((p) => p.user.description));

  followersAmount$ = this.profile$.pipe(map((p) => p.socialStats.followers));

  followeesAmount$ = this.profile$.pipe(map((p) => p.socialStats.followees));

  personalReviewsAmount$ = this.profile$.pipe(map((p) => p.personalReviewsAmount));

  registerDate$ = this.profile$.pipe(
    map((p) => p.user.createdAt),
    map((date) => dayjs(date).format('DD.MM.YYYY')),
  );

  isSubscribed$ = this.profile$.pipe(map((p) => p.additionalInfo.isSubscribed));

  collections$ = this.profile$.pipe(map((p) => p.collections.items.map((i) => i.collection)));

  id$ = this.profile$.pipe(map((p) => p.user.id));

  loadingFollowButton = signal(false);

  private currentUser$ = this.store.select(selectCurrentUser);

  isOwnerPage$ = combineLatest([this.currentUser$, this.id$]).pipe(
    map(([currentUser, id]) => currentUser?.id === id),
  );

  personalCollectionLink$ = this.profile$.pipe(
    map((p) => ['/profile', p.user.id, 'personal-collection']),
  );

  follow() {
    this.id$
      .pipe(
        tap(() => this.loadingFollowButton.set(true)),
        switchMap((id) =>
          this.profileService.follow(id).pipe(finalize(() => this.loadingFollowButton.set(false))),
        ),
        take(1),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.profilePageStore.handleFollowed();
      });
  }

  unfollow() {
    this.id$
      .pipe(
        tap(() => this.loadingFollowButton.set(true)),
        switchMap((id) =>
          this.profileService
            .unfollow(id)
            .pipe(finalize(() => this.loadingFollowButton.set(false))),
        ),
        take(1),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.profilePageStore.handleUnfollowed();
      });
  }
}
