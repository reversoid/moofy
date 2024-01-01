import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiButtonModule, TuiDialogService } from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-stats-island',
  standalone: true,
  imports: [TuiIslandModule, TuiButtonModule],
  templateUrl: './stats-island.component.html',
  styleUrl: './stats-island.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsIslandComponent {
  constructor(private readonly dialogService: TuiDialogService) {}

  openCommentsDialog() {
    this.dialogService.open('Some comments here', { label: 'Комментарии' }).subscribe();
  }

  handleLike() {
    console.log('collection liked');
  }

  handleBookmark() {
    console.log('collection bookmarked');
  }
}
