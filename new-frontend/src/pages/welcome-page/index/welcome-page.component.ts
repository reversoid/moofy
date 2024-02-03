import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiLinkModule } from '@taiga-ui/core';
import {
  LinkItem,
  LinksGroupComponent,
} from '../../../shared/ui/links-group/links-group.component';

@Component({
  selector: 'app-welcome-page',
  standalone: true,
  imports: [RouterModule, TuiLinkModule, LinksGroupComponent],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomePageComponent {
  activeItemIndex = 0;

  linkItems: LinkItem[] = [
    { label: 'Мои коллекции', link: '/welcome/collections' },
    { label: 'Избранное', link: '/welcome/favorites' },
  ];
}
