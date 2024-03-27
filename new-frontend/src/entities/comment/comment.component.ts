import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import { CommentWithInfo } from '../../shared/types';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [TuiIslandModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent {
  @Input({ required: true }) comment!: CommentWithInfo;
}
