import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiBreakpointService, TuiButtonModule } from '@taiga-ui/core';
import { TuiCarouselModule, TuiIslandModule, TuiPaginationModule } from '@taiga-ui/kit';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    TuiButtonModule,
    NgOptimizedImage,
    TuiIslandModule,
    NgOptimizedImage,
    TuiCarouselModule,
    TuiPaginationModule,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class LandingPageComponent implements OnInit {
  constructor(
    private readonly breakpoint$: TuiBreakpointService,
    private readonly destroy$: TuiDestroyService,
  ) {}

  ngOnInit(): void {
    this.breakpoint$.pipe(takeUntil(this.destroy$)).subscribe((bp) => {
      switch (bp) {
        case 'desktopLarge':
          this.itemsVisible.set(3);
          break;

        case 'desktopSmall':
          this.itemsVisible.set(2);
          break;

        case 'mobile':
          this.itemsVisible.set(1);
          break;
      }
    });
  }

  carouselIndex = 0;
  itemsAmount = 4;
  itemsVisible = signal(3);

  get paginationAmount() {
    return Math.ceil(this.itemsAmount / this.itemsVisible());
  }

  get prevDisabled() {
    return this.carouselIndex <= 0;
  }

  get nextDisabled() {
    return this.carouselIndex >= this.paginationAmount;
  }

  onIndex(index: number) {
    this.carouselIndex = index * this.itemsVisible();
  }
}
