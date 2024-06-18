import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TuiThemeNightModule } from '@taiga-ui/core';

@Component({
  selector: 'app-night-theme',
  standalone: true,
  imports: [TuiThemeNightModule],
  templateUrl: './night-theme.component.html',
  styleUrl: './night-theme.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class NightThemeComponent {}
