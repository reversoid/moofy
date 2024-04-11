import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserGridComponent } from '../../../widgets/user-grid/user-grid.component';
import { TuiButtonModule } from '@taiga-ui/core';

@Component({
  selector: 'app-followers-page',
  standalone: true,
  imports: [UserGridComponent, TuiButtonModule],
  templateUrl: './followers-page.component.html',
  styleUrl: './followers-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FollowersPageComponent {}
