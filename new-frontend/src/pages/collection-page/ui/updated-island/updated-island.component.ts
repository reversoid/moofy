import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import { Dayjs } from 'dayjs';

const toDateString = (value: Dayjs | null) => value?.format('DD.MM.YYYY');

@Component({
  selector: 'app-updated-island',
  standalone: true,
  imports: [TuiIslandModule],
  templateUrl: './updated-island.component.html',
  styleUrl: './updated-island.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatedIslandComponent {
  @Input({
    transform: (v: Dayjs | null) => toDateString(v),
  })
  date?: string | null;
}
