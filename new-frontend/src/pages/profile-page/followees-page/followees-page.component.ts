import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserGridComponent } from '../../../widgets/user-grid/user-grid.component';
import { TuiButtonModule } from '@taiga-ui/core';

@Component({
  selector: 'app-followees-page',
  standalone: true,
  imports: [UserGridComponent, TuiButtonModule],
  templateUrl: './followees-page.component.html',
  styleUrl: './followees-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolloweesPageComponent {}
