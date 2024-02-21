import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiLinkModule } from '@taiga-ui/core';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [TuiLinkModule],
  templateUrl: './support.component.html',
  styleUrl: './support.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SupportComponent {}
