import { AsyncPipe, NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';
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
  constructor(private readonly cdr: ChangeDetectorRef) {}

  @Input({ required: true }) user!: User;

  dropdownOpen = false;

  onClick(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  closeDropdown() {
    this.dropdownOpen = false;
    this.cdr.markForCheck();
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
