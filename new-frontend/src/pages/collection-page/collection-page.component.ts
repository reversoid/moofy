import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  TuiButtonModule,
  TuiDialogService,
  TuiLinkModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiCheckboxModule,
  TuiInputModule,
  TuiIslandModule,
  TuiTagModule,
  TuiTextareaModule,
} from '@taiga-ui/kit';

@Component({
  selector: 'app-collection-page',
  standalone: true,
  imports: [
    TuiTextfieldControllerModule,
    FormsModule,
    ReactiveFormsModule,
    TuiInputModule,
    TuiIslandModule,
    NgOptimizedImage,
    RouterModule,
    TuiLinkModule,
    TuiButtonModule,
    TuiCheckboxModule,
    TuiSvgModule,
    TuiTagModule,
  ],
  templateUrl: './collection-page.component.html',
  styleUrl: './collection-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionPageComponent {
  constructor(private readonly dialogService: TuiDialogService) {}

  search = new FormControl<string>('');

  openCommentsDialog() {
    this.dialogService
      .open('Some comments here', { label: 'Комментарии' })
      .subscribe();
  }

  handleLike() {
    console.log('collection liked');
  }

  handleBookmark() {
    console.log('collection bookmarked');
  }

  showInfoAboutCollection() {
    this.dialogService
      .open('Some modal here', { label: 'О коллекции' })
      .subscribe();
  }
}
