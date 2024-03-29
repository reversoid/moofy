import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiButtonModule, TuiLinkModule } from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [TuiIslandModule, TuiButtonModule, TuiLinkModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent {
  // @Input({ required: true }) comment!: CommentWithInfo;
}
