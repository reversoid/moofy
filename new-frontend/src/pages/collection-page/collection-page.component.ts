import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CollectionComponent } from '../../entities/collection/collection.component';
import { TuiInputModule } from '@taiga-ui/kit';
import { TuiLabelModule, TuiSvgModule } from '@taiga-ui/core';

@Component({
  selector: 'app-collection-page',
  standalone: true,
  imports: [CollectionComponent, TuiInputModule, TuiLabelModule, TuiSvgModule],
  templateUrl: './collection-page.component.html',
  styleUrl: './collection-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionPageComponent {}
