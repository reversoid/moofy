import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  TuiButtonModule,
  TuiHintModule,
  TuiTextfieldControllerModule,
  tuiHintOptionsProvider,
} from '@taiga-ui/core';
import { TuiFieldErrorPipeModule, TuiTextareaModule } from '@taiga-ui/kit';
import { required } from '../../../../shared/utils/validators';

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
  textControl = new FormControl<string>('', {
    validators: [required('Комментарий не должен быть пустым')],
  });

  get canSubmit() {
    return this.textControl.valid;
  }

  submitComment() {
    console.log(this.textControl.value);
  }
}
