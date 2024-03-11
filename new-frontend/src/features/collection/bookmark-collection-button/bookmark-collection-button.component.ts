import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiSvgModule } from '@taiga-ui/core';
import { TuiCheckboxBlockModule } from '@taiga-ui/kit';
import { EMPTY, catchError, finalize, switchMap, takeUntil, tap } from 'rxjs';
import { Collection } from '../../../shared/types';
import { CollectionService } from '../utils/collection.service';

@Component({
  selector: 'app-bookmark-collection-button',
  standalone: true,
  imports: [TuiCheckboxBlockModule, TuiSvgModule, FormsModule, ReactiveFormsModule],
  templateUrl: './bookmark-collection-button.component.html',
  styleUrl: './bookmark-collection-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class BookmarkCollectionButtonComponent implements OnInit {
  constructor(
    private readonly destroy$: TuiDestroyService,
    private readonly collectionService: CollectionService,
  ) {}

  @Input({ required: true }) collectionId!: Collection['id'];

  @Input() isBookmarked = false;

  @Output() bookmarkProcessed = new EventEmitter<void>();

  bookmarkControl = new FormControl(false);

  ngOnInit(): void {
    this.setupInitialBookmarkValue();
    this.initializeBookmark();
  }

  private setupInitialBookmarkValue() {
    this.bookmarkControl.setValue(this.isBookmarked);
  }

  private initializeBookmark() {
    this.bookmarkControl.valueChanges
      .pipe(
        tap(() => {
          this.bookmarkControl.disable({ emitEvent: false });
        }),

        switchMap((bookmark) => {
          const result = bookmark
            ? this.collectionService.bookmarkCollection(this.collectionId)
            : this.collectionService.unbookmarkCollection(this.collectionId);

          return result.pipe(
            finalize(() => {
              this.bookmarkControl.enable({ emitEvent: false });
            }),
            catchError(() => EMPTY),
          );
        }),

        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.bookmarkProcessed.emit();
      });
  }
}
