import { NgClass, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiSidebarModule } from '@taiga-ui/addon-mobile';
import { TuiActiveZoneModule, TuiObscuredModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiDropdownModule } from '@taiga-ui/core';

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
}
