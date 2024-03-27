import { AsyncPipe, NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiLinkModule } from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import { User } from '../../../../shared/types';

@Component({
  selector: 'app-creator-island',
  standalone: true,
  imports: [TuiIslandModule, TuiLinkModule, RouterModule, NgOptimizedImage, AsyncPipe, NgIf],
  templateUrl: './creator-island.component.html',
  styleUrl: './creator-island.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatorIslandComponent {
  @Input() user?: User | null;
}
