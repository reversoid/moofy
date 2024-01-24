import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiNotificationModule } from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import { CollectionGridComponent } from '../../widgets/collection-grid/collection-grid.component';

@Component({
  selector: 'app-feed-page',
  standalone: true,
  imports: [TuiIslandModule, TuiNotificationModule, CollectionGridComponent],
  templateUrl: './feed-page.component.html',
  styleUrl: './feed-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedPageComponent {}
