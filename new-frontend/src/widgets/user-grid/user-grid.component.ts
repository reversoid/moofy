import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
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

  @Input() view: UsersView = 'list';

  @Input() profiles: ShortProfile[] = [];

  @Input() loadKey: string | null = null;

  followLoading = signal(false);

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
      .subscribe();
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
      .subscribe();
  }
}
