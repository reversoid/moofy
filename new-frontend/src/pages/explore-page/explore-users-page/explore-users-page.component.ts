import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserGridComponent } from '../../../widgets/user-grid/user-grid.component';

@Component({
  selector: 'app-explore-users-page',
  standalone: true,
  imports: [UserGridComponent],
  templateUrl: './explore-users-page.component.html',
  styleUrl: './explore-users-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExploreUsersPageComponent {}
