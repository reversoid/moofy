import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiIslandModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-creator-island',
  standalone: true,
  imports: [TuiIslandModule],
  templateUrl: './creator-island.component.html',
  styleUrl: './creator-island.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatorIslandComponent {}
