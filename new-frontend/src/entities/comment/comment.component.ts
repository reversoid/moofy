import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiButtonModule, TuiLinkModule } from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [TuiIslandModule, TuiButtonModule, TuiLinkModule, NgClass, RouterModule, NgIf],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommentComponent {
  @Input() nested = false;
  // @Input({ required: true }) comment!: CommentWithInfo;
}
