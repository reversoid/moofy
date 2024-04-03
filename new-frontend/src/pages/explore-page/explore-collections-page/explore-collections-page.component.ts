import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CollectionGridComponent } from '../../../widgets/collection-grid/collection-grid.component';

@Component({
  selector: 'app-explore-collections-page',
  standalone: true,
  imports: [CollectionGridComponent],
  templateUrl: './explore-collections-page.component.html',
  styleUrl: './explore-collections-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExploreCollectionsPageComponent {}
