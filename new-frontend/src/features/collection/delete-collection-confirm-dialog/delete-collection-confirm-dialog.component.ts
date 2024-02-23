import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TuiButtonModule, TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'app-delete-collection-confirm-dialog',
  standalone: true,
  imports: [TuiButtonModule],
  templateUrl: './delete-collection-confirm-dialog.component.html',
  styleUrl: './delete-collection-confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteCollectionConfirmDialogComponent {
  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext,
  ) {}

  confirmDelete() {
    this.context.completeWith();
  }
}
