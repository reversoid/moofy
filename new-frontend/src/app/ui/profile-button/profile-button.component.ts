import { AsyncPipe, NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiActiveZoneModule, TuiLetModule, TuiObscuredModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDropdownModule,
  TuiSvgModule,
} from '@taiga-ui/core';
import { User } from '../../../shared/types';

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
  ],
  templateUrl: './profile-button.component.html',
  styleUrl: './profile-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileButtonComponent {
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
}
