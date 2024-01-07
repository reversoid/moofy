import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TuiButtonModule, TuiDialogService, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/kit';
import { map } from 'rxjs';
import { CreatorIslandComponent } from './ui/creator-island/creator-island.component';
import { DescriptionIslandComponent } from './ui/description-island/description-island.component';
import { ImageIslandComponent } from './ui/image-island/image-island.component';
import { StatsIslandComponent } from './ui/stats-island/stats-island.component';
import { UpdatedIslandComponent } from './ui/updated-island/updated-island.component';
import { ReviewListComponent } from '../../widgets/review-list/review-list.component';

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
  ) {}

  search = new FormControl<string>('');

  response = this.httpClient.get<{ ok: boolean }>('profile').pipe(map((v) => v));

  showInfoAboutCollection() {
    this.dialogService.open('Some modal here', { label: 'О коллекции' }).subscribe();
  }
}
