import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-welcome-step',
  standalone: true,
  imports: [],
  templateUrl: './welcome-step.component.html',
  styleUrl: './welcome-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeStepComponent {
  @Output() completed = new EventEmitter<void>();

  handleButtonClick() {
    this.completed.emit();
  }
}
