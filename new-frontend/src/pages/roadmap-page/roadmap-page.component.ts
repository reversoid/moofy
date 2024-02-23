import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiHintModule, TuiLinkModule, TuiTooltipModule } from '@taiga-ui/core';
import { TuiBadgeModule, TuiIslandModule } from '@taiga-ui/kit';

type RoadmapItem = {
  title: string;
  description: string;
  type: 'feature' | 'improve';
};

@Component({
  selector: 'app-roadmap-page',
  standalone: true,
  imports: [
    TuiLinkModule,
    RouterLink,
    TuiIslandModule,
    TuiBadgeModule,
    TuiTooltipModule,
    TuiHintModule,
    NgFor,
  ],
  templateUrl: './roadmap-page.component.html',
  styleUrl: './roadmap-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoadmapPageComponent {
  roadmap: RoadmapItem[] = [
    {
      title: 'Улучшенная лента',
      description: 'Новый дизайн и возможности ленты.',
      type: 'improve',
    },
    {
      title: 'Рекомендации к просмотру',
      description:
        'Алгоритм, основанный на предпочтениях, который предложит пользователю фильмы к просмотру',
      type: 'feature',
    },
    {
      title: 'Рекомендации к групповому просмотру',
      description:
        'Алгоритм, основанный на предпочтениях, который предложит группе пользователей фильмы к просмотру',
      type: 'feature',
    },
  ];
}
