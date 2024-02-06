import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiButtonModule } from '@taiga-ui/core';
import { SelectMethodStepComponent } from './steps/select-method-step/select-method-step.component';
import { WelcomeStepComponent } from './steps/welcome-step/welcome-step.component';
import { SelectCombineOptionsStepComponent } from './steps/select-combine-options-step/select-combine-options-step.component';
import { SelectCollectionsToCombineStepComponent } from './steps/select-collections-to-combine-step/select-collections-to-combine-step.component';
import { CollectionOptionsStepComponent } from './steps/collection-options-step/collection-options-step.component';
import { Collection } from '../../../shared/types';

export type CreatePersonalCollectionSteps =
  | 'welcome'
  | 'select-method'
  | 'select-collections-to-combine'
  | 'select-combine-options'
  | 'collection-options';

export interface PersonalCollectionData {
  collectionData?: Pick<Collection, 'name' | 'description' | 'imageUrl'>;
  combineOptions?: {
    collectionIdsToCombine?: number[];
    reviewsOptions?: {
      strategy: 'copy' | 'move';
    };
    actionAfterMerging?: 'save' | 'remove';
  };
}

@Component({
  selector: 'app-new-personal-collection-page',
  standalone: true,
  imports: [
    TuiButtonModule,
    WelcomeStepComponent,
    SelectMethodStepComponent,
    SelectCombineOptionsStepComponent,
    SelectCollectionsToCombineStepComponent,
    CollectionOptionsStepComponent,
  ],
  templateUrl: './new-personal-collection-page.component.html',
  styleUrl: './new-personal-collection-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewPersonalCollectionPageComponent {
  currentStep: CreatePersonalCollectionSteps = 'welcome';

  private createPersonalCollectionData: PersonalCollectionData = {};

  welcomeStepCompleted() {
    this.currentStep = 'select-method';
  }

  selectMethodStepCompleted(method: 'new' | 'combine') {
    if (method === 'new') {
      this.currentStep = 'collection-options';
    } else if (method === 'combine') {
      this.currentStep = 'select-collections-to-combine';
    }
  }

  private createPersonalCollection() {
    console.log(this.createPersonalCollectionData);
  }

  collectionOptionsStepCompleted(data: NonNullable<PersonalCollectionData['collectionData']>) {
    this.createPersonalCollectionData = {
      ...this.createPersonalCollectionData,
      collectionData: data,
    };

    this.createPersonalCollection();
  }

  selectCollectionsToCombineStepCompleted(collectionIds: number[]) {
    this.createPersonalCollectionData = {
      ...this.createPersonalCollectionData,
      combineOptions: {
        collectionIdsToCombine: collectionIds,
      },
    };

    this.currentStep = 'select-combine-options';
  }

  selectCombineOptionsStepCompleted(
    options: Pick<
      NonNullable<PersonalCollectionData['combineOptions']>,
      'actionAfterMerging' | 'collectionIdsToCombine'
    >,
  ) {
    this.createPersonalCollectionData = {
      ...this.createPersonalCollectionData,
      combineOptions: {
        ...this.createPersonalCollectionData.combineOptions,
        ...options,
      },
    };

    this.currentStep = 'collection-options';
  }
}
