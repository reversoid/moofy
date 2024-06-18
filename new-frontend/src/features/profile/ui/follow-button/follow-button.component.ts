import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { User } from '../../../../shared/types';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { ProfileService } from '../../utils/profile.service';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { finalize, takeUntil } from 'rxjs';

@Component({
  selector: 'app-follow-button',
  standalone: true,
  imports: [NgIf, TuiLoaderModule, TuiButtonModule],
  templateUrl: './follow-button.component.html',
  styleUrl: './follow-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class FollowButtonComponent {
  constructor(
    private readonly profileService: ProfileService,
    private readonly destroy$: TuiDestroyService,
  ) {}

  isSubscribed = input.required<boolean>();

  userId = input.required<User['id']>();

  followLoading = signal(false);

  private _isFollowing = signal<boolean | null>(null);

  isFollowing = computed(() => this._isFollowing() ?? this.isSubscribed());

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
        this._isFollowing.set(true);
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
      .subscribe(() => this._isFollowing.set(false));
  }
}
