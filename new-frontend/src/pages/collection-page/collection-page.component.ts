import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-collection-page',
  standalone: true,
  imports: [],
  templateUrl: './collection-page.component.html',
  styleUrl: './collection-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionPageComponent {

}
