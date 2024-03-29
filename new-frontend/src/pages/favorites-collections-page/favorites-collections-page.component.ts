import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CollectionGridComponent } from '../../widgets/collection-grid/collection-grid.component';
import { TuiInputModule } from '@taiga-ui/kit';
import { TuiTextfieldControllerModule } from '@taiga-ui/core';

@Component({
  selector: 'app-favorites-collections-page',
  standalone: true,
  imports: [CollectionGridComponent, TuiInputModule, TuiTextfieldControllerModule],
  templateUrl: './favorites-collections-page.component.html',
  styleUrl: './favorites-collections-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesCollectionsPageComponent {}
