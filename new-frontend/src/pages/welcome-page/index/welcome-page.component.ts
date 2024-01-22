import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiLinkModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiTabsModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [TuiTabsModule, TuiSvgModule, RouterModule, TuiLinkModule],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomePageComponent {
  activeItemIndex = 0;
}
