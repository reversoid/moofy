import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IntersectionObserverModule } from '@ng-web-apis/intersection-observer';
import { TuiLoaderModule } from '@taiga-ui/core';

@Component({
  selector: 'app-intersection-loader',
  standalone: true,
  imports: [IntersectionObserverModule, TuiLoaderModule],
  templateUrl: './intersection-loader.component.html',
  styleUrl: './intersection-loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IntersectionLoaderComponent {
  @Input() loadMoreKey: string | null = null;

  @Output() loadMore = new EventEmitter<string>();

  private lastEmitedLoadKey: string | null = null;

  handleLoadIntersection(observerEntries: IntersectionObserverEntry[]) {
    const isVisible = observerEntries.at(-1)!.isIntersecting;

    const newKey = this.lastEmitedLoadKey !== this.loadMoreKey;

    if (isVisible && newKey && this.loadMoreKey) {
      this.lastEmitedLoadKey = this.loadMoreKey;
      this.loadMore.emit(this.loadMoreKey);
    }
  }
}
