import { NgClass, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  input,
} from '@angular/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import { UserCardComponent } from '../../entities/user-card/user-card.component';
import { ShortProfile } from '../../shared/types';
import { FollowButtonComponent } from '../../features/profile/ui/follow-button/follow-button.component';
import { IntersectionLoaderComponent } from '../../shared/ui/intersection-loader/intersection-loader.component';

export type UsersView = 'list' | 'grid';

// TODO create shared component for grid. MOVE CollectionGridService to that shared one. Because it duplicates.

@Component({
  selector: 'app-user-grid',
  standalone: true,
  imports: [
    UserCardComponent,
    NgClass,
    TuiButtonModule,
    NgFor,
    NgIf,
    TuiLoaderModule,
    TuiIslandModule,
    FollowButtonComponent,
    IntersectionLoaderComponent,
  ],
  templateUrl: './user-grid.component.html',
  styleUrl: './user-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class UserGridComponent {
  @Input() loadMoreKey: string | null = null;

  @Input() loading: boolean = false;

  @Output() loadMore = new EventEmitter<string>();

  profiles = input<ShortProfile[]>([]);
}
