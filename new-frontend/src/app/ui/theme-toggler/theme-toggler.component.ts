import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiButtonModule } from '@taiga-ui/core';
import { NightService } from '../../utils/night.service';
import { map } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-theme-toggler',
  standalone: true,
  imports: [TuiButtonModule, AsyncPipe],
  templateUrl: './theme-toggler.component.html',
  styleUrl: './theme-toggler.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeTogglerComponent {
  constructor(public readonly nightService: NightService) {}

  themeButtonIcon = this.nightService.theme.pipe(
    map((v) => {
      return v === 'onDark' ? 'tuiIconMoonLarge' : 'tuiIconSunLarge';
    }),
  );

  toggleTheme() {
    this.nightService.toggleTheme();
  }
}
