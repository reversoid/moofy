import { NgIf, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Collection } from '../../shared/types';
import { CardComponent } from '../../shared/ui/link-card/card.component';
import { RouterModule } from '@angular/router';
import { TuiLinkModule } from '@taiga-ui/core';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [NgOptimizedImage, CardComponent, RouterModule, TuiLinkModule, NgIf],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionComponent {
  @Input() view?: 'vertical' | 'horizontal' = 'vertical';

  @Input({ required: true }) collection!: Collection;

  @Input() hideDescription?: boolean = false;

  get link() {
    return ['/collections', this.collection.id];
  }
}
