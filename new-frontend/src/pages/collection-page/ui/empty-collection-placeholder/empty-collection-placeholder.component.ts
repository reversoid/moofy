import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiIslandModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-empty-collection-placeholder',
  standalone: true,
  imports: [TuiIslandModule],
  templateUrl: './empty-collection-placeholder.component.html',
  styleUrl: './empty-collection-placeholder.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyCollectionPlaceholderComponent {}
