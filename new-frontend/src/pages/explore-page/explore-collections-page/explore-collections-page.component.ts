import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CollectionGridComponent } from '../../../widgets/collection-grid/collection-grid.component';
import { TuiButtonModule } from '@taiga-ui/core';
import { CollectionGridService } from '../../../widgets/collection-grid/collection-grid.service';

@Component({
  selector: 'app-explore-collections-page',
  standalone: true,
  imports: [CollectionGridComponent, TuiButtonModule],
  templateUrl: './explore-collections-page.component.html',
  styleUrl: './explore-collections-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CollectionGridService],
})
export class ExploreCollectionsPageComponent {
  constructor(readonly collectionGridService: CollectionGridService) {}
}
