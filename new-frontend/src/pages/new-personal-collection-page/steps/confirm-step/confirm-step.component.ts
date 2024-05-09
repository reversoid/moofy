import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import { CreatePersonalCollectionFlowService } from '../../utils/create-personal-collection-flow.service';
import { Router } from '@angular/router';
import { combineLatestWith, finalize, takeUntil } from 'rxjs';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../app/store';
import { selectCurrentUser } from '../../../../entities/current-user/selectors';
import { NgIf } from '@angular/common';
import { PersonalCollectionService } from '../../../../features/personal-collection/personal-collection.service';

@Component({
  selector: 'app-confirm-step',
  standalone: true,
  imports: [TuiButtonModule, TuiIslandModule, TuiLoaderModule, NgIf],
  templateUrl: './confirm-step.component.html',
  styleUrl: './confirm-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class ConfirmStepComponent {
  constructor(
    private readonly flowService: CreatePersonalCollectionFlowService,
    private readonly personalCollectionService: PersonalCollectionService,
    private readonly router: Router,
    private readonly destroy$: TuiDestroyService,
    private readonly store: Store<AppState>,
  ) {}

  loading = signal(false);

  currentUser$ = this.store.select(selectCurrentUser);

  isCombineMethod = Boolean(
    this.flowService.newPersonalCollectionData?.collectionIdsToMerge &&
      this.flowService.newPersonalCollectionData?.combineOptions,
  );

  isCopy = this.flowService.newPersonalCollectionData?.combineOptions?.reviewsStrategy === 'copy';

  withScore = this.flowService.newPersonalCollectionData?.combineOptions?.withScore || undefined;

  actionAfterMerging =
    this.flowService.newPersonalCollectionData?.combineOptions?.actionAfterMerging;

  handleConfirm() {
    console.log(this.flowService.newPersonalCollectionData);

    const newPersonalCollectionData = this.flowService.newPersonalCollectionData;

    if (!newPersonalCollectionData) {
      this.router.navigateByUrl('/personal-collection');
      return;
    }

    const { collectionData, collectionIdsToMerge, combineOptions } = newPersonalCollectionData;

    this.loading.set(true);

    this.personalCollectionService
      .createPersonalCollection({
        name: collectionData.name,
        description: collectionData.description,
        imageUrl: collectionData.imageUrl,

        mergeOptions:
          combineOptions && collectionIdsToMerge
            ? {
                actionAfterMergingCollections: combineOptions.actionAfterMerging,
                collectionsIds: collectionIdsToMerge,
                reviews: {
                  strategy: combineOptions.reviewsStrategy,
                  withScore: combineOptions.withScore || undefined,
                },
              }
            : undefined,
      })
      .pipe(
        finalize(() => this.loading.set(false)),
        combineLatestWith(this.currentUser$),
        takeUntil(this.destroy$),
      )
      .subscribe(([, curentUser]) => {
        this.router.navigate(['profile', curentUser!.id, 'personal-collection']);
      });
  }
}