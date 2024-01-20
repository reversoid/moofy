import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-collection-card',
  standalone: true,
  imports: [],
  templateUrl: './collection-card.component.html',
  styleUrl: './collection-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionCardComponent {

}
