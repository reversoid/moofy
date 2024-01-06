import { AsyncPipe, NgClass, NgFor, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiActiveZoneModule, TuiObscuredModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDropdownModule,
  TuiGroupModule,
  TuiLinkModule,
  TuiSvgModule,
} from '@taiga-ui/core';
import { TuiActionModule } from '@taiga-ui/kit';
import { NightService } from '../../utils/night.service';
import { LogoComponent } from '../../../assets/logo/logo.component';
import { map } from 'rxjs';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BurgerMenuComponent } from '../burger-menu/burger-menu.component';
import { TuiSidebarModule } from '@taiga-ui/addon-mobile';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    AsyncPipe,
    NgClass,
    NgOptimizedImage,
    TuiButtonModule,
    TuiDropdownModule,
    TuiActiveZoneModule,
    TuiObscuredModule,
    TuiDataListModule,
    RouterModule,
    NgFor,
    TuiSvgModule,
    TuiLinkModule,
    TuiActionModule,
    TuiGroupModule,
    LogoComponent,
    SidebarComponent,
    BurgerMenuComponent,
    TuiSidebarModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  constructor(public readonly nightService: NightService) {}

  get themeButtonIcon() {
    return this.nightService.theme.pipe(
      map((v) => {
        return v === 'onDark' ? 'tuiIconMoonLarge' : 'tuiIconSunLarge';
      }),
    );
  }

  toggleTheme() {
    this.nightService.toggleTheme();
  }

  sidebarOpen = false;

  dropdownOpen = false;

  onClick(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
  }

  onObscured(obscured: boolean): void {
    if (obscured) {
      this.dropdownOpen = false;
    }
  }

  onActiveZone(active: boolean): void {
    this.dropdownOpen = active && this.dropdownOpen;
  }

  menuItems = [
    {
      label: 'Мой профиль',
      routerLink: '/welcome',
      icon: 'tuiIconUserLarge',
    },
    {
      label: 'Настройки',
      routerLink: '/collections/1',
      icon: 'tuiIconSettingsLarge',
    },
    {
      label: 'Выйти',
      routerLink: '/settings',
      icon: 'tuiIconLogOutLarge',
    },
  ];
}
