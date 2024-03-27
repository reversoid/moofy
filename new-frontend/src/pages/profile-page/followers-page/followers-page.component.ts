import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserGridComponent } from '../../../widgets/user-grid/user-grid.component';
import { CollectionGridService } from '../../../widgets/collection-grid/collection-grid.service';
import { TuiButtonModule } from '@taiga-ui/core';

@Component({
  selector: 'app-followers-page',
  standalone: true,
  imports: [UserGridComponent, TuiButtonModule],
  templateUrl: './followers-page.component.html',
  styleUrl: './followers-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CollectionGridService],
})
export class FollowersPageComponent {
  constructor(readonly collectionGridService: CollectionGridService) {}
}
