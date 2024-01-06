import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiActiveZoneModule, TuiObscuredModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiDataListModule, TuiDropdownModule } from '@taiga-ui/core';

@Component({
  selector: 'app-profile-button',
  standalone: true,
  imports: [
    TuiButtonModule,
    TuiDropdownModule,
    TuiActiveZoneModule,
    TuiObscuredModule,
    TuiDataListModule,
    RouterModule,
    NgOptimizedImage,
  ],
  templateUrl: './profile-button.component.html',
  styleUrl: './profile-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileButtonComponent {
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
}
