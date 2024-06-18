import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { TuiSidebarModule } from '@taiga-ui/addon-mobile';
import { TuiButtonModule, TuiGroupModule, TuiLinkModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiActionModule, TuiIslandModule } from '@taiga-ui/kit';
import { LogoComponent } from '../../../assets/logo/logo.component';
import { selectCurrentUser } from '../../../entities/current-user/selectors';
import { AppState } from '../../store';
import { BurgerMenuComponent } from '../burger-menu/burger-menu.component';
import { NotificationButtonComponent } from '../notification-button/notification-button.component';
import { ProfileButtonComponent } from '../profile-button/profile-button.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { WrapperComponent } from '../wrapper/wrapper.component';
import { TabletHeaderLinksComponent } from '../tablet-header-links/tablet-header-links.component';

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
    TuiIslandModule,
    WrapperComponent,
    TabletHeaderLinksComponent,
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
