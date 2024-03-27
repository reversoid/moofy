import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TuiIslandModule, TuiRadioLabeledModule, TuiRadioListModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiDialogService } from '@taiga-ui/core';
import { NgFor } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RadioContentComponent } from './radio-content/radio-content.component';
import { TuiDestroyService, TuiMapperPipeModule } from '@taiga-ui/cdk';
import { takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { CreatePersonalCollectionDialogComponent } from '../../../../../features/collection/create-personal-collection-dialog/create-personal-collection-dialog.component';
import { Collection } from '../../../../../shared/types';
import { CreatePersonalCollectionFlowService } from '../../create-personal-collection-flow.service';

type Option<ID = unknown> = {
  id: ID;
  name: string;
  description: string;
  mood: 'neutral' | 'positive' | 'negative';
};

type ReviewsToPick = 'DESC' | 'DESC_SCORE';

type ReviewsStrategy = 'COPY' | 'MOVE';

type CollectionStrategy = 'SAVE' | 'REMOVE_EMPTY' | 'REMOVE_ALL';

@Component({
  selector: 'app-select-combine-options-step',
  standalone: true,
  imports: [
    TuiRadioListModule,
    TuiButtonModule,
    TuiIslandModule,
    FormsModule,
    ReactiveFormsModule,
    TuiRadioLabeledModule,
    NgFor,
    RadioContentComponent,
    TuiMapperPipeModule,
  ],
  templateUrl: './select-combine-options-step.component.html',
  styleUrl: './select-combine-options-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class SelectCombineOptionsStepComponent implements OnInit {
  constructor(
    private readonly fb: FormBuilder,
    private readonly destroy$: TuiDestroyService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly dialogService: TuiDialogService,
    private readonly flowService: CreatePersonalCollectionFlowService,
  ) {}

  reviewsToPickOptions: Option<ReviewsToPick>[] = [
    {
      id: 'DESC',
      name: 'С описанием',
      description: 'Все обзоры с описанием будут участвовать в объединении',
      mood: 'neutral',
    },

    {
      id: 'DESC_SCORE',
      name: 'С оценкой и описанием',
      description: 'Все обзоры с оценкой и описанием будут участвовать в объединении',
      mood: 'neutral',
    },
  ];

  reviewsStrategyOptions: Option<ReviewsStrategy>[] = [
    {
      id: 'COPY',
      name: 'Скопировать',
      description: 'Обзоры останутся в коллекциях',
      mood: 'positive',
    },

    {
      id: 'MOVE',
      name: 'Перенести',
      description: 'Обзоры будут перенесены из коллекций',
      mood: 'negative',
    },
  ];

  collectionsStrategyOptions: Option<CollectionStrategy>[] = [
    {
      id: 'SAVE',
      name: 'Сохранять',
      description: 'Все коллекции будут сохранены',
      mood: 'positive',
    },

    {
      id: 'REMOVE_EMPTY',
      name: 'Удалить пустые',
      description: 'Если после переноса обзоров останутся пустые коллекции, то они будут удалены',
      mood: 'negative',
    },

    {
      id: 'REMOVE_ALL',
      name: 'Удалить все',
      description: 'Все объединенные коллекции будут удалены',
      mood: 'negative',
    },
  ];

  form = this.fb.group({
    reviewsToPick: this.fb.control<ReviewsToPick>('DESC'),
    reviewsStrategy: this.fb.control<ReviewsStrategy>('COPY'),
    collectionsStrategy: this.fb.control<CollectionStrategy>('SAVE'),
  });

  submitForm() {
    this.completeOptionsStep();

    this.openCollectionOptionsDialog()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.completeCollectionDataStep(data);
        this.router.navigate(['..', 'confirm'], { relativeTo: this.route });
      });
  }

  private openCollectionOptionsDialog() {
    return this.dialogService.open<Pick<Collection, 'name' | 'imageUrl' | 'description'>>(
      new PolymorpheusComponent(CreatePersonalCollectionDialogComponent),
      {
        size: 's',
        label: 'Настройки коллекции',
      },
    );
  }

  private completeCollectionDataStep(data: Pick<Collection, 'name' | 'imageUrl' | 'description'>) {
    this.flowService.completeStep({ type: 'collectionData', payload: data });
  }

  get isSelectedCopyReviewsStrategy() {
    return this.form.value.reviewsStrategy === 'COPY';
  }

  ngOnInit(): void {
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((f) => {
      const cannotBeBoth = f.reviewsStrategy !== 'MOVE' && f.collectionsStrategy === 'REMOVE_EMPTY';
      if (cannotBeBoth) {
        this.form.controls.collectionsStrategy.patchValue('SAVE');
      }
    });
  }

  private completeOptionsStep() {
    const formValues = this.form.value;
    const actionAfterMegingMap: Record<
      CollectionStrategy,
      'saveAll' | 'removeAll' | 'removeEmpty'
    > = {
      REMOVE_ALL: 'removeAll',
      REMOVE_EMPTY: 'removeEmpty',
      SAVE: 'saveAll',
    };

    const reviewsStrategyMap: Record<ReviewsStrategy, 'move' | 'copy'> = {
      MOVE: 'move',
      COPY: 'copy',
    };

    this.flowService.completeStep({
      type: 'combineOptions',
      payload: {
        actionAfterMerging: actionAfterMegingMap[formValues.collectionsStrategy!],
        reviewsStrategy: reviewsStrategyMap[formValues.reviewsStrategy!],
        withScore: formValues.reviewsToPick === 'DESC_SCORE',
      },
    });
  }
}
