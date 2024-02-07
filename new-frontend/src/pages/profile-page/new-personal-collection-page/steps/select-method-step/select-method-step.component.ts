import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButtonModule } from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-select-method-step',
  standalone: true,
  imports: [TuiButtonModule, TuiIslandModule, RouterLink],
  templateUrl: './select-method-step.component.html',
  styleUrl: './select-method-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectMethodStepComponent {}
