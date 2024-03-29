import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TuiButtonModule,
  TuiHintModule,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
  tuiHintOptionsProvider,
} from '@taiga-ui/core';
import { TuiFieldErrorPipeModule, TuiTextareaModule } from '@taiga-ui/kit';
import { maxLength, required } from '../../../../shared/utils/validators';

@Component({
  selector: 'app-send-comment-form',
  standalone: true,
  imports: [
    TuiTextareaModule,
    TuiTextfieldControllerModule,
    TuiButtonModule,
    FormsModule,
    ReactiveFormsModule,
    TuiHintModule,
    TuiFieldErrorPipeModule,
    TuiLoaderModule,
  ],
  templateUrl: './send-comment-form.component.html',
  styleUrl: './send-comment-form.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiHintOptionsProvider({
      icon: 'tuiIconAlertCircleLarge',
    }),
  ],
})
export class SendCommentFormComponent {
  @Input() loading = false;

  @Output() commentSubmit = new EventEmitter<string>();

  textControl = new FormControl<string>('', {
    validators: [
      required('Комментарий не должен быть пустым'),
      maxLength(400, 'Комментарий не должен превышать 400 символов'),
    ],
  });

  get canSubmit() {
    return this.textControl.valid && !this.loading;
  }

  submitComment() {
    if (!this.canSubmit || !this.textControl.value) {
      return;
    }

    this.commentSubmit.emit(this.textControl.value);
  }
}
