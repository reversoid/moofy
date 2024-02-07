import { NgClass, NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Collection } from '../../shared/types';
import { CardComponent } from '../../shared/ui/card/card.component';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [NgOptimizedImage, NgIf, CardComponent, NgClass],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionComponent {
  @Input() view?: 'vertical' | 'horizontal' = 'vertical';

  @Input({ required: true }) collection!: Collection;

  @Input() hideDescription?: boolean = false;
}
