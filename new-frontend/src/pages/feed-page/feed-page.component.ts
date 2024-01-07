import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiIslandModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-feed-page',
  standalone: true,
  imports: [TuiIslandModule],
  templateUrl: './feed-page.component.html',
  styleUrl: './feed-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedPageComponent {}
