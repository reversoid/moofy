import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDropdownModule,
  TuiHostedDropdownModule,
  TuiSvgModule,
} from '@taiga-ui/core';
import { TUI_ARROW } from '@taiga-ui/kit';

@Component({
  selector: 'app-tablet-header-links',
  standalone: true,
  imports: [
    TuiButtonModule,
    TuiDataListModule,
    TuiHostedDropdownModule,
    RouterModule,
    TuiSvgModule,
  ],
  templateUrl: './tablet-header-links.component.html',
  styleUrl: './tablet-header-links.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabletHeaderLinksComponent {
  readonly arrow = TUI_ARROW;

  items = [
    {
      label: 'Лента',
      routerLink: '/feed',
    },
    {
      label: 'Избранное',
      routerLink: '/favorites',
    },
    {
      label: 'Коллекции',
      routerLink: '/collections',
    },
  ];
}
