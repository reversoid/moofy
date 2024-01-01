import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiLinkModule } from '@taiga-ui/core';
import { TuiIslandModule, TuiTagModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [TuiIslandModule, TuiTagModule, TuiLinkModule, NgOptimizedImage],
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewComponent {}
