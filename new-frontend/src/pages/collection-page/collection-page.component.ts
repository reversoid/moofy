import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TuiButtonModule, TuiDialogService, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/kit';
import { map } from 'rxjs';
import { CreatorIslandComponent } from './ui/creator-island/creator-island.component';
import { DescriptionIslandComponent } from './ui/description-island/description-island.component';
import { ImageIslandComponent } from './ui/image-island/image-island.component';
import { StatsIslandComponent } from './ui/stats-island/stats-island.component';
import { UpdatedIslandComponent } from './ui/updated-island/updated-island.component';
import { ReviewListComponent } from '../../widgets/review-list/review-list.component';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { CreateReviewDialogComponent } from './ui/create-review-dialog/create-review-dialog.component';

@Component({
  selector: 'app-collection-page',
  standalone: true,
  imports: [
    AsyncPipe,
    TuiTextfieldControllerModule,
    FormsModule,
    ReactiveFormsModule,
    TuiInputModule,
    RouterModule,
    TuiButtonModule,
    CreatorIslandComponent,
    DescriptionIslandComponent,
    ImageIslandComponent,
    StatsIslandComponent,
    UpdatedIslandComponent,
    ReviewListComponent,
  ],
  templateUrl: './collection-page.component.html',
  styleUrl: './collection-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionPageComponent {
  constructor(
    private readonly dialogService: TuiDialogService,
    private readonly httpClient: HttpClient,
    private readonly injector: Injector,
    private readonly activatedRoute: ActivatedRoute,
  ) {}

  search = new FormControl<string>('');

  response = this.httpClient.get<{ ok: boolean }>('profile').pipe(map((v) => v));

  private readonly isPersonal$ = this.activatedRoute.data.pipe(
    map((v) => Boolean(v['isPersonal'])),
  );

  showInfoAboutCollection() {
    this.dialogService.open('Some modal here', { label: 'О коллекции' }).subscribe();
  }

  createReview() {
    this.dialogService
      .open(new PolymorpheusComponent(CreateReviewDialogComponent, this.injector), {
        label: 'Добавить фильм',
        size: 's',
      })
      .subscribe();
  }
}
