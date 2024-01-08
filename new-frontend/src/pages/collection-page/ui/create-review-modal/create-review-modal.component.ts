import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiDataListModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiElasticContainerModule, TuiInputModule } from '@taiga-ui/kit';
import { of } from 'rxjs';

@Component({
  selector: 'app-create-review-modal',
  standalone: true,
  imports: [
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiLetModule,
    NgIf,
    TuiDataListModule,
    AsyncPipe,
    NgForOf,
    TuiButtonModule,
    TuiElasticContainerModule,
  ],
  templateUrl: './create-review-modal.component.html',
  styleUrl: './create-review-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateReviewModalComponent {
  users$ = of([{ username: 'aboba' }, { username: 'grenka' }, { username: 'floppa' }]);

  user: any;

  get content(): any {
    return this.user?.username;
  }

  select(user: any) {
    this.user = user;
  }
}
