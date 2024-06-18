import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiDialogService } from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Collection } from '../../../../shared/types';
import { CreatePersonalCollectionDialogComponent } from '../../../../features/collection/create-personal-collection-dialog/create-personal-collection-dialog.component';
import { takeUntil } from 'rxjs';
import { CreatePersonalCollectionFlowService } from '../../utils/create-personal-collection-flow.service';

@Component({
  selector: 'app-select-method-step',
  standalone: true,
  imports: [TuiButtonModule, TuiIslandModule, RouterLink],
  templateUrl: './select-method-step.component.html',
  styleUrl: './select-method-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class SelectMethodStepComponent {
  constructor(
    private readonly destroy$: TuiDestroyService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dialogService: TuiDialogService,
    private readonly flowService: CreatePersonalCollectionFlowService,
  ) {}

  selectEmptyCollection() {
    this.dialogService
      .open<Pick<Collection, 'name' | 'imageUrl' | 'description'>>(
        new PolymorpheusComponent(CreatePersonalCollectionDialogComponent),
        {
          size: 's',
          label: 'Настройки коллекции',
        },
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.flowService.completeStep({ type: 'collectionData', payload: data });
        this.router.navigate(['..', 'confirm'], { relativeTo: this.route });
      });
  }
}
