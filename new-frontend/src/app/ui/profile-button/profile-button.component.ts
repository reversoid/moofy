import { AsyncPipe, NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  TuiActiveZoneModule,
  TuiDestroyService,
  TuiLetModule,
  TuiObscuredModule,
} from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDropdownModule,
  TuiHostedDropdownModule,
  TuiSvgModule,
} from '@taiga-ui/core';
import { User } from '../../../shared/types';
import { AuthService } from '../../../features/auth/auth.service';
import { takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { currentUserActions } from '../../../entities/current-user/actions';

@Component({
  selector: 'app-profile-button',
  standalone: true,
  imports: [
    AsyncPipe,
    TuiButtonModule,
    TuiDropdownModule,
    TuiActiveZoneModule,
    TuiObscuredModule,
    TuiDataListModule,
    RouterModule,
    NgOptimizedImage,
    TuiLetModule,
    TuiSvgModule,
    NgIf,
    TuiHostedDropdownModule,
  ],
  templateUrl: './profile-button.component.html',
  styleUrl: './profile-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class ProfileButtonComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly destroy$: TuiDestroyService,
    private readonly store: Store<AppState>,
  ) {}

  @Input({ required: true }) user!: User;

  dropdownOpen = signal<boolean>(false);

  onClick(): void {
    this.dropdownOpen.update((open) => !open);
  }

  closeDropdown() {
    this.dropdownOpen.set(false);
  }

  onObscured(obscured: boolean): void {
    if (obscured) {
      this.dropdownOpen.set(false);
    }
  }

  onActiveZone(active: boolean): void {
    this.dropdownOpen.update((open) => active && open);
  }

  handleLogoutClick() {
    this.authService
      .logout()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.store.dispatch(currentUserActions.clear());
      });
    this.closeDropdown();
  }
}
