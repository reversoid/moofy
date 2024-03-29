import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SendCommentFormComponent } from '../../features/comments/ui/send-comment-form/send-comment-form.component';

@Component({
  selector: 'app-comments-dialog',
  standalone: true,
  imports: [SendCommentFormComponent],
  templateUrl: './comments-dialog.component.html',
  styleUrl: './comments-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsDialogComponent {}
