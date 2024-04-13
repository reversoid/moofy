import { NgClass, NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Collection } from '../../shared/types';
import { CardComponent } from '../../shared/ui/card/card.component';
import { ColorHash } from '../../shared/utils/color-hash';
import { TuiHintModule, TuiSvgModule } from '@taiga-ui/core';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [NgOptimizedImage, NgIf, CardComponent, NgClass, TuiSvgModule, TuiHintModule],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionComponent {
  constructor(private readonly colorHash: ColorHash) {}

  @Input() view?: 'vertical' | 'horizontal' = 'vertical';

  @Input() collection?: Collection;

  @Input() hideDescription?: boolean = false;

  private get hashColor() {
    return this.collection && this.colorHash.hex(String(this.collection.id));
  }

  get hashBackgroundStyle() {
    return `background-color: ${this.hashColor};`;
  }
}
