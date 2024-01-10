import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiIslandModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-link-card',
  standalone: true,
  imports: [NgOptimizedImage, TuiIslandModule, RouterModule],
  templateUrl: './link-card.component.html',
  styleUrl: './link-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkCardComponent {
  @Input() title?: string;

  @Input() link?: string | any[] | null | undefined;
}
