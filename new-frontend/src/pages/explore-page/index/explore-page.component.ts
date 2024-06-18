import { AsyncPipe, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiGroupModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import {
  TuiInputModule,
  TuiIslandModule,
  TuiRadioBlockModule,
  TuiRadioLabeledModule,
} from '@taiga-ui/kit';
import { combineLatest, debounceTime, take, takeUntil } from 'rxjs';
import { ExplorePageStore } from '../model/explore-page.store';

type SearchObject = 'profiles' | 'collections';

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
    TuiGroupModule,
    TuiRadioBlockModule,
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
    private readonly exlorePageStore: ExplorePageStore,
    private readonly activatedRoute: ActivatedRoute,
  ) {}

  searchObjects: Array<{ value: SearchObject; label: string }> = [
    { value: 'profiles', label: 'Пользователи' },
    { value: 'collections', label: 'Коллекции' },
  ];

  exploreOptionsForm = this.fb.group({
    searchObject: this.fb.control<SearchObject>(this.searchObjects[0].value),
    search: this.fb.control(''),
  });

  ngOnInit(): void {
    this.initForm();
    this.initExistingQueryParams();
  }

  private initForm() {
    this.initSearchObject();
    this.initSearchObjectChange();

    this.initSearchFieldChange();
  }

  private initSearchObject() {
    this.activatedRoute.children[0].url
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((segment) => {
        this.exploreOptionsForm.controls.searchObject.setValue(segment[0].path as SearchObject);
      });
  }

  private initSearchObjectChange() {
    combineLatest([
      this.exploreOptionsForm.controls.searchObject.valueChanges,
      this.activatedRoute.url,
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([v]) => {
        if (!v) {
          return;
        }

        this.router.navigate([v], {
          relativeTo: this.activatedRoute,
          queryParamsHandling: 'preserve',
        });
      });
  }

  private initSearchFieldChange() {
    this.exploreOptionsForm.controls.search.valueChanges
      .pipe(debounceTime(350), takeUntil(this.destroy$))
      .subscribe((search) => {
        this.addSearchToParams(search);
        this.exlorePageStore.setSearch(search || null);
      });
  }

  private addSearchToParams(search: string | null) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: search ? { search: search } : null,
    });
  }

  private initExistingQueryParams() {
    this.activatedRoute.queryParamMap.pipe(take(1), takeUntil(this.destroy$)).subscribe((s) => {
      const searchValue = s.get('search');

      if (searchValue) {
        this.exlorePageStore.setSearch(searchValue);
        this.exploreOptionsForm.controls.search.setValue(searchValue, { emitEvent: false });
      }
    });
  }
}
