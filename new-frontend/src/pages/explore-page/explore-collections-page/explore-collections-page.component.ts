import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CollectionGridComponent } from '../../../widgets/collection-grid/collection-grid.component';
import { TuiButtonModule } from '@taiga-ui/core';

type CollectionsView = 'list' | 'grid';

@Component({
  selector: 'app-explore-collections-page',
  standalone: true,
  imports: [CollectionGridComponent, TuiButtonModule],
  templateUrl: './explore-collections-page.component.html',
  styleUrl: './explore-collections-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExploreCollectionsPageComponent {
  collectionsView: CollectionsView = 'list';

  toggleCollectionsView() {
    this.collectionsView = this.toggleViewMap[this.collectionsView];
  }

  get collectionsViewIcon() {
    return this.iconViewMap[this.collectionsView];
  }

  private readonly toggleViewMap: Record<CollectionsView, CollectionsView> = {
    grid: 'list',
    list: 'grid',
  };

  private readonly iconViewMap: Record<CollectionsView, string> = {
    grid: 'tuiIconGridLarge',
    list: 'tuiIconListLarge',
  };
}
