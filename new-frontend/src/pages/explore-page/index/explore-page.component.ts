import { AsyncPipe, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiInputModule, TuiIslandModule, TuiRadioLabeledModule } from '@taiga-ui/kit';
import { combineLatest, debounceTime, takeUntil } from 'rxjs';
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
  }

  private initForm() {
    this.initSearchObjectChange();
    this.initSearchFieldChange();
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
        this.router.navigate([v], { relativeTo: this.activatedRoute });
      });
  }

  private initSearchFieldChange() {
    this.exploreOptionsForm.controls.search.valueChanges
      .pipe(debounceTime(350), takeUntil(this.destroy$))
      .subscribe((search) => {
        this.exlorePageStore.setSearch(search || null);
      });
  }
}
