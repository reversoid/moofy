import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TuiIslandModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-description-island',
  standalone: true,
  imports: [TuiIslandModule],
  templateUrl: './description-island.component.html',
  styleUrl: './description-island.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DescriptionIslandComponent {
  @Input() description?: string | null;
}
