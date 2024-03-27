import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-comments-dialog',
  standalone: true,
  imports: [],
  templateUrl: './comments-dialog.component.html',
  styleUrl: './comments-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsDialogComponent {}
