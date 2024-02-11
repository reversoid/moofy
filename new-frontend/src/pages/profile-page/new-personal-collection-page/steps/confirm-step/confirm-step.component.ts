import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-confirm-step',
  standalone: true,
  imports: [],
  templateUrl: './confirm-step.component.html',
  styleUrl: './confirm-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmStepComponent {}
