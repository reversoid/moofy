import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TuiButtonModule, TuiLinkModule } from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [TuiIslandModule, TuiButtonModule, TuiLinkModule, NgClass],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent {
  @Input() nested = Math.random() > 0.5;
  // @Input({ required: true }) comment!: CommentWithInfo;
}
