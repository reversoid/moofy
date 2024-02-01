import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserCardComponent } from '../../../entities/user-card/user-card.component';
import { User } from '../../../shared/types';

@Component({
  selector: 'app-explore-users-page',
  standalone: true,
  imports: [UserCardComponent],
  templateUrl: './explore-users-page.component.html',
  styleUrl: './explore-users-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExploreUsersPageComponent {
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
