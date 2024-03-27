import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { UserCardComponent } from '../../entities/user-card/user-card.component';
import { User } from '../../shared/types';
import { NgClass } from '@angular/common';
import { TuiButtonModule } from '@taiga-ui/core';

export type UsersView = 'list' | 'grid';

// TODO create shared component for grid. MOVE CollectionGridService to that shared one. Because it duplicates.

@Component({
  selector: 'app-user-grid',
  standalone: true,
  imports: [UserCardComponent, NgClass, TuiButtonModule],
  templateUrl: './user-grid.component.html',
  styleUrl: './user-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserGridComponent {
  @Input() view: UsersView = 'grid';

  user: User = {
    imageUrl:
      'https://moofy.storage.yandexcloud.net/list-images/75f8e535-2e34-4f8b-8148-fccba89471d1.webp',
    createdAt: new Date().toISOString(),
    description: 'Hello there',
    id: 1,
    username: 'reversoid',
  };

  user2: User = {
    imageUrl:
      'https://moofy.storage.yandexcloud.net/list-images/75f8e535-2e34-4f8b-8148-fccba89471d1.webp',
    createdAt: new Date().toISOString(),
    description: 'Hello there!! sjajsd sjssj sdjs djsd sjds djs dsjds djsdjs d djsjdsj',
    id: 1,
    username: 'reversoid',
  };
}
