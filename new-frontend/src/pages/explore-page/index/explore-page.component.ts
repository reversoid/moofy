import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { TuiSvgModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiInputModule, TuiTabsModule } from '@taiga-ui/kit';
import { filter, map } from 'rxjs';
import {
  LinkItem,
  LinksGroupComponent,
} from '../../../shared/ui/links-group/links-group.component';

@Component({
  selector: 'app-explore-page',
  standalone: true,
  imports: [
    RouterModule,
    TuiTabsModule,
    TuiSvgModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    LinksGroupComponent,
    AsyncPipe,
  ],
  templateUrl: './explore-page.component.html',
  styleUrl: './explore-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExplorePageComponent {
  constructor(private readonly router: Router) {}

  activeItemIndex = 0;

  links: LinkItem[] = [
    { label: 'Пользователи', link: 'profiles' },
    { label: 'Коллекции', link: 'collections' },
  ];

  selectedLinkIndex$ = this.router.events.pipe(filter((v) => v instanceof NavigationEnd)).pipe(
    map((v) => {
      if (!(v instanceof NavigationEnd)) {
        return null;
      }
      // TODO some logic for returning correct index
      return null;
    }),
  );
}
