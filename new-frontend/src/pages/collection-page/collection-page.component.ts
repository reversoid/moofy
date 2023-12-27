import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CollectionComponent } from '../../entities/collection/collection.component';

@Component({
  selector: 'app-collection-page',
  standalone: true,
  imports: [CollectionComponent],
  templateUrl: './collection-page.component.html',
  styleUrl: './collection-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionPageComponent {}
