import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CollectionComponent } from '../../entities/collection/collection.component';
import { TuiLoaderModule } from '@taiga-ui/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-collection-grid',
  standalone: true,
  imports: [NgIf, CollectionComponent, TuiLoaderModule],
  templateUrl: './collection-grid.component.html',
  styleUrl: './collection-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionGridComponent {
  loading = true;
}
