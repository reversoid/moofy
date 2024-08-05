import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiButtonModule } from '@taiga-ui/core';
import { TuiCarouselModule, TuiIslandModule, TuiPaginationModule } from '@taiga-ui/kit';

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
})
export class LandingPageComponent {
  carouselIndex = 0;
  itemsAmount = 4;
  itemsVisible = 3;

  get paginationAmount() {
    return Math.ceil(this.itemsAmount / this.itemsVisible);
  }

  get prevDisabled() {
    return this.carouselIndex <= 0;
  }

  get nextDisabled() {
    return this.carouselIndex >= this.paginationAmount;
  }

  onIndex(index: number) {
    this.carouselIndex = index * this.itemsVisible;
  }
}
