import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Collection } from '../../shared/types';
import { LinkCardComponent } from '../../shared/ui/link-card/link-card.component';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [NgOptimizedImage, LinkCardComponent],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionComponent {
  @Input({ required: true }) collection!: Collection;

  get link() {
    return ['collections', this.collection.id];
  }
}
