import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiButtonModule } from '@taiga-ui/core';
import { CollectionGridService } from '../../../widgets/collection-grid/collection-grid.service';
import { UserGridComponent } from '../../../widgets/user-grid/user-grid.component';

@Component({
  selector: 'app-explore-users-page',
  standalone: true,
  imports: [TuiButtonModule, UserGridComponent],
  templateUrl: './explore-users-page.component.html',
  styleUrl: './explore-users-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CollectionGridService],
})
export class ExploreUsersPageComponent {
  constructor(readonly collectionGridService: CollectionGridService) {}
}
