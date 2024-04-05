import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UserGridComponent } from '../../../widgets/user-grid/user-grid.component';
import { ExplorePageStore } from '../model/explore-page.store';
import { combineLatestWith, switchMap, takeUntil } from 'rxjs';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { ExploreService } from '../../../features/explore/explore.service';

@Component({
  selector: 'app-explore-users-page',
  standalone: true,
  imports: [UserGridComponent],
  templateUrl: './explore-users-page.component.html',
  styleUrl: './explore-users-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class ExploreUsersPageComponent implements OnInit {
  constructor(
    private readonly explorePageStore: ExplorePageStore,
    private readonly destroy$: TuiDestroyService,
    private readonly exploreService: ExploreService,
  ) {}

  ngOnInit(): void {
    this.initHandleSearchChange();
  }

  private initHandleSearchChange() {
    this.explorePageStore.search$
      .pipe(
        switchMap((search) => {
          if (search) {
            return this.exploreService.searchProfiles(search);
          }

          return this.exploreService.getTopProfiles();
        }),
        combineLatestWith(this.explorePageStore.search$),
        takeUntil(this.destroy$),
      )
      .subscribe(([result, search]) => {
        this.explorePageStore.setProfiles({ search, items: result.items });
      });
  }
}
