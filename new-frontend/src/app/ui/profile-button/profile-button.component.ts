import { AsyncPipe, NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { TuiDestroyService, TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDropdownModule,
  TuiHostedDropdownModule,
  TuiSvgModule,
} from '@taiga-ui/core';
import { takeUntil } from 'rxjs';
import { currentUserActions } from '../../../entities/current-user/actions';
import { AuthService } from '../../../features/auth/auth.service';
import { User } from '../../../shared/types';
import { AppState } from '../../store';

@Component({
  selector: 'app-profile-button',
  standalone: true,
  imports: [
    AsyncPipe,
    TuiButtonModule,
    TuiDropdownModule,
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

  closeDropdown() {
    this.dropdownOpen.set(false);
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
