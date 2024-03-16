import { AsyncPipe, NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Data, RouterModule } from '@angular/router';
import { TuiIslandModule } from '@taiga-ui/kit';
import { CollectionGridComponent } from '../../widgets/collection-grid/collection-grid.component';
import { TuiButtonModule } from '@taiga-ui/core';
import { Profile } from '../../shared/types';
import { map } from 'rxjs';
import dayjs from 'dayjs';

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
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent {
  constructor(private readonly activatedRoute: ActivatedRoute) {}

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

  collections$ = this.profile$.pipe(map((p) => p.collections.items));

  follow() {}

  unfollow() {}
}
