import { ChangeDetectionStrategy, Component, Input, computed, input, signal } from '@angular/core';
import { UserCardComponent } from '../../entities/user-card/user-card.component';
import { ShortProfile, User } from '../../shared/types';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { ProfileService } from '../../features/profile/profile.service';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { finalize, takeUntil } from 'rxjs';

export type UsersView = 'list' | 'grid';

// TODO create shared component for grid. MOVE CollectionGridService to that shared one. Because it duplicates.

@Component({
  selector: 'app-user-grid',
  standalone: true,
  imports: [UserCardComponent, NgClass, TuiButtonModule, NgFor, NgIf, TuiLoaderModule],
  templateUrl: './user-grid.component.html',
  styleUrl: './user-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class UserGridComponent {
  constructor(
    private readonly profileService: ProfileService,
    private readonly destroy$: TuiDestroyService,
  ) {}

  private followedProfiles = signal<Map<User['id'], boolean>>(new Map());

  @Input() view: UsersView = 'list';

  @Input() loadKey: string | null = null;

  @Input() loading: boolean = false;

  profiles = input<ShortProfile[]>([]);

  followLoading = signal(false);

  profilesToShow = computed(() => {
    return this.profiles().map((profile) => {
      const isSubscribed =
        this.followedProfiles().get(profile.user.id) ?? profile.additionalInfo.isSubscribed;

      return { ...profile, additionalInfo: { isSubscribed } } satisfies ShortProfile;
    });
  });

  follow(userId: User['id']) {
    this.followLoading.set(true);
    this.profileService
      .follow(userId)
      .pipe(
        finalize(() => {
          this.followLoading.set(false);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.followedProfiles.update((v) => new Map(v.set(userId, true)));
      });
  }

  unfollow(userId: User['id']) {
    this.followLoading.set(true);

    this.profileService
      .unfollow(userId)
      .pipe(
        finalize(() => {
          this.followLoading.set(false);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.followedProfiles.update((v) => new Map(v.set(userId, false))));
  }
}
