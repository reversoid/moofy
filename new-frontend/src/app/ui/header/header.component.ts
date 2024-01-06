import { NgClass, NgFor, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiSidebarModule } from '@taiga-ui/addon-mobile';
import { TuiActiveZoneModule, TuiObscuredModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDropdownModule,
  TuiSvgModule,
} from '@taiga-ui/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgClass,
    NgOptimizedImage,
    TuiButtonModule,
    TuiDropdownModule,
    TuiActiveZoneModule,
    TuiObscuredModule,
    TuiSidebarModule,
    TuiDataListModule,
    RouterModule,
    NgFor,
    TuiSvgModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
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

  toggle(): void {
    this.sidebarOpen = !this.sidebarOpen;
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
