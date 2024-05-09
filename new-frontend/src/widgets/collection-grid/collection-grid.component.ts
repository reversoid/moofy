import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CollectionComponent } from '../../entities/collection/collection.component';
import { TuiLinkModule, TuiLoaderModule } from '@taiga-ui/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Collection } from '../../shared/types';
import { RouterLink } from '@angular/router';
import { TuiIslandModule } from '@taiga-ui/kit';
import { IntersectionLoaderComponent } from '../../shared/ui/intersection-loader/intersection-loader.component';

@Component({
  selector: 'app-collection-grid',
  standalone: true,
  imports: [
    NgIf,
    CollectionComponent,
    TuiLoaderModule,
    NgClass,
    RouterLink,
    TuiLinkModule,
    NgFor,
    TuiIslandModule,
    IntersectionLoaderComponent,
  ],
  templateUrl: './collection-grid.component.html',
  styleUrl: './collection-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionGridComponent {
  @Input() view: 'grid' | 'list' = 'list';

  @Input() hideDescription?: boolean = false;

  @Input() collections?: Collection[] = [];

  @Input() loadMoreKey: string | null = null;

  @Input() loading: boolean = false;

  @Output() loadMore = new EventEmitter<string>();
}
