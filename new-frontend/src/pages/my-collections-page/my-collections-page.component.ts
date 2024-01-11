import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiButtonModule, TuiLabelModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/kit';
import { CollectionComponent } from '../../entities/collection/collection.component';
import { CollectionGridComponent } from '../../widgets/collection-grid/collection-grid.component';
import { CardComponent } from '../../shared/ui/link-card/card.component';

@Component({
  selector: 'app-collection-page',
  standalone: true,
  imports: [
    CollectionComponent,
    TuiInputModule,
    TuiLabelModule,
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
    FormsModule,
    CollectionGridComponent,
    TuiButtonModule,
    CardComponent,
  ],
  templateUrl: './my-collections-page.component.html',
  styleUrl: './my-collections-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
})
export class MyCollectionsPageComponent {
  search = new FormControl<string>('');

  openCreateCollectionModal() {
    console.log('hi');
  }
}
