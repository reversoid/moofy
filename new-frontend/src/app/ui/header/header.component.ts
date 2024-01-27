import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { TuiSidebarModule } from '@taiga-ui/addon-mobile';
import { TuiButtonModule, TuiGroupModule, TuiLinkModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiActionModule } from '@taiga-ui/kit';
import { LogoComponent } from '../../../assets/logo/logo.component';
import { selectCurrentUser } from '../../../entities/current-user/selectors';
import { AppState } from '../../store';
import { BurgerMenuComponent } from '../burger-menu/burger-menu.component';
import { NotificationButtonComponent } from '../notification-button/notification-button.component';
import { ProfileButtonComponent } from '../profile-button/profile-button.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    TuiButtonModule,
    RouterModule,
    TuiSvgModule,
    TuiLinkModule,
    TuiActionModule,
    TuiGroupModule,
    LogoComponent,
    SidebarComponent,
    BurgerMenuComponent,
    TuiSidebarModule,
    ProfileButtonComponent,
    NotificationButtonComponent,
    NgIf,
    AsyncPipe,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  constructor(private readonly store: Store<AppState>) {}

  user$ = this.store.select(selectCurrentUser);

  sidebarOpen = false;
}
