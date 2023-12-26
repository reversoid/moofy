import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiButtonModule, TuiDropdownModule } from '@taiga-ui/core';
import { TuiAvatarModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgOptimizedImage, TuiButtonModule, TuiDropdownModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  open = false;

  onClick(): void {
    this.open = !this.open;
  }

  onObscured(obscured: any): void {
    console.log(obscured);

    if (obscured) {
      this.open = false;
    }
  }

  onActiveZone(active: any): void {
    console.log(active);

    this.open = active && this.open;
  }
}
