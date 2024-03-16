import { AsyncPipe, NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ActivatedRoute, Data, RouterModule } from '@angular/router';
import { TuiIslandModule } from '@taiga-ui/kit';
import { CollectionGridComponent } from '../../widgets/collection-grid/collection-grid.component';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { Profile } from '../../shared/types';
import { finalize, map, switchMap, take, takeUntil, tap } from 'rxjs';
import dayjs from 'dayjs';
import { ProfileService } from '../../features/profile/profile.service';
import { TuiDestroyService } from '@taiga-ui/cdk';

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
  providers: [TuiDestroyService],
})
export class ProfilePageComponent {
  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly profileService: ProfileService,
    private readonly destroy$: TuiDestroyService,
  ) {}

  private profile$ = this.activatedRoute.data.pipe(map<Data, Profile>((data) => data['profile']));

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
      .subscribe(console.log);
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
      .subscribe(console.log);
  }
}
