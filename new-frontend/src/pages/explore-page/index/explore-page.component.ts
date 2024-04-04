import { AsyncPipe, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiInputModule, TuiIslandModule, TuiRadioLabeledModule } from '@taiga-ui/kit';
import { debounceTime, takeUntil } from 'rxjs';
import { ExploreService } from '../../../features/explore/explore.service';
import { ExplorePageStore } from '../model/explore-page.store';

@Component({
  selector: 'app-explore-page',
  standalone: true,
  imports: [
    RouterModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    AsyncPipe,
    TuiIslandModule,
    TuiRadioLabeledModule,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
  ],
  templateUrl: './explore-page.component.html',
  styleUrl: './explore-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, ExplorePageStore],
})
export class ExplorePageComponent implements OnInit {
  constructor(
    private readonly fb: FormBuilder,
    private readonly destroy$: TuiDestroyService,
    private readonly router: Router,
    private readonly exploreService: ExploreService,
    private readonly exlorePageStore: ExplorePageStore,
  ) {}

  searchObjects = [
    { value: 'users', label: 'Пользователи' },
    { value: 'collections', label: 'Коллекции' },
  ];

  exploreOptionsForm = this.fb.group({
    searchObject: this.fb.control(this.searchObjects[0].value),
    search: this.fb.control(''),
  });

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.initSearchObjectChange();
    this.initSearchFieldChange();
  }

  private initSearchObjectChange() {}

  private initSearchFieldChange() {
    this.exploreOptionsForm.controls.search.valueChanges
      .pipe(debounceTime(150), takeUntil(this.destroy$))
      .subscribe((v) => {});
  }
}
