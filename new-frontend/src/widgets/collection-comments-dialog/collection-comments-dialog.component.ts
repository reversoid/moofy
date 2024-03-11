import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-collection-comments-dialog',
  standalone: true,
  imports: [],
  templateUrl: './collection-comments-dialog.component.html',
  styleUrl: './collection-comments-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionCommentsDialogComponent {}
