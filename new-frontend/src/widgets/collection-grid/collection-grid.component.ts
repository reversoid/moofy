import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CollectionComponent } from '../../entities/collection/collection.component';
import { TuiLoaderModule } from '@taiga-ui/core';
import { NgClass, NgIf } from '@angular/common';
import { Collection } from '../../shared/types';

@Component({
  selector: 'app-collection-grid',
  standalone: true,
  imports: [NgIf, CollectionComponent, TuiLoaderModule, NgClass],
  templateUrl: './collection-grid.component.html',
  styleUrl: './collection-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionGridComponent {
  @Input() view?: 'grid' | 'list' = 'grid';

  @Input() hideDescription?: boolean = false;

  loading = true;

  collection: Collection = {
    id: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    description: 'description',
    isPublic: true,
    name: 'Some collection and yeah it is very long word',
    user: {
      id: 1,
      createdAt: new Date().toISOString(),
      description: 'some desc',
      imageUrl:
        'https://moofy.storage.yandexcloud.net/profile-images/be3b783c-3ab6-48f2-864d-3b81bd9612fd.webp',
      username: 'reversoid',
    },
    imageUrl:
      'https://moofy.storage.yandexcloud.net/list-images/75f8e535-2e34-4f8b-8148-fccba89471d1.webp',
  };
}
