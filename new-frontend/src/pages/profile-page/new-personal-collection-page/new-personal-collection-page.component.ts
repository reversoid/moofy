import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Collection } from '../../../shared/types';

export interface PersonalCollectionData {
  collectionData?: Pick<Collection, 'name' | 'description' | 'imageUrl'>;
  mergeOptions?: {
    collectionIds: number[];
    reviews: {
      withScore: boolean;
      strategy: 'copy' | 'move';
    };
    actionAfterMerging: 'saveAll' | 'removeAll' | 'removeEmpty';
  };
}

@Component({
  selector: 'app-new-personal-collection-page',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './new-personal-collection-page.component.html',
  styleUrl: './new-personal-collection-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewPersonalCollectionPageComponent {}
