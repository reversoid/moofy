import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-select-method-step',
  standalone: true,
  imports: [],
  templateUrl: './select-method-step.component.html',
  styleUrl: './select-method-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectMethodStepComponent {
  @Output() completed = new EventEmitter<'new' | 'combine'>();

  handleSelectMethod(method: 'new' | 'combine') {
    this.completed.emit(method);
  }
}
