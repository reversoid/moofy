import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiSidebarModule } from '@taiga-ui/addon-mobile';
import { TuiButtonModule, TuiGroupModule, TuiLinkModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiActionModule } from '@taiga-ui/kit';
import { LogoComponent } from '../../../assets/logo/logo.component';
import { BurgerMenuComponent } from '../burger-menu/burger-menu.component';
import { ProfileButtonComponent } from '../profile-button/profile-button.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ThemeTogglerComponent } from '../theme-toggler/theme-toggler.component';

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
    ThemeTogglerComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  sidebarOpen = false;
}
