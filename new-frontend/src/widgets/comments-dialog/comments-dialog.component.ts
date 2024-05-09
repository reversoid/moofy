import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiNotificationModule } from '@taiga-ui/core';

@Component({
  selector: 'app-comments-dialog',
  standalone: true,
  imports: [TuiNotificationModule],
  templateUrl: './comments-dialog.component.html',
  styleUrl: './comments-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentsDialogComponent {}
