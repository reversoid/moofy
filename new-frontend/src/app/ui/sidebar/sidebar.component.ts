import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiSidebarModule } from '@taiga-ui/addon-mobile';
import { TuiButtonModule, TuiDialogService, TuiLinkModule } from '@taiga-ui/core';
import { TuiIslandModule, TuiMarkerIconModule } from '@taiga-ui/kit';
import { AuthService } from '../../../features/auth/auth.service';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import { currentUserActions } from '../../../entities/current-user/actions';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { ProfileNotificationsDialogComponent } from '../../../features/profile-notifications';
import { selectCurrentUser } from '../../../entities/current-user/selectors';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    TuiSidebarModule,
    TuiButtonModule,
    TuiIslandModule,
    TuiMarkerIconModule,
    RouterModule,
    TuiLinkModule,
    AsyncPipe,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class SidebarComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly store: Store<AppState>,
    private readonly dialogService: TuiDialogService,
  ) {}

  @Output() sidebarClose = new EventEmitter<void>();

  get profileLink() {
    return ['/profile'];
  }

  currentUserId$ = this.store.select(selectCurrentUser).pipe(map((u) => u?.id));

  openNotifications() {
    this.closeDropdown();

    this.dialogService
      .open(new PolymorpheusComponent(ProfileNotificationsDialogComponent), {
        label: 'Уведомления',
        size: 'l',
      })
      .subscribe();
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.store.dispatch(currentUserActions.clear());
    });

    this.closeDropdown();
  }

  closeDropdown() {
    this.sidebarClose.emit();
  }
}
