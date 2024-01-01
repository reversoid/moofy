import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiIslandModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-updated-island',
  standalone: true,
  imports: [TuiIslandModule],
  templateUrl: './updated-island.component.html',
  styleUrl: './updated-island.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatedIslandComponent {}
