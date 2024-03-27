import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TuiButtonModule } from '@taiga-ui/core';

@Component({
  selector: 'app-welcome-step',
  standalone: true,
  imports: [TuiButtonModule, RouterLink],
  templateUrl: './welcome-step.component.html',
  styleUrl: './welcome-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeStepComponent {}
