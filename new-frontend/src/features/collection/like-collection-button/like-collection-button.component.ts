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
import { Collection, CollectionWithInfo } from '../../../shared/types';
import { CollectionService } from '../utils/collection.service';

@Component({
  selector: 'app-like-collection-button',
  standalone: true,
  imports: [TuiCheckboxBlockModule, TuiSvgModule, FormsModule, ReactiveFormsModule],
  templateUrl: './like-collection-button.component.html',
  styleUrl: './like-collection-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class LikeCollectionButtonComponent implements OnInit {
  constructor(
    private readonly destroy$: TuiDestroyService,
    private readonly collectionService: CollectionService,
  ) {}

  @Input({ required: true }) collectionId!: Collection['id'];

  @Input() isLiked: boolean = false;

  @Output() likeProcessed = new EventEmitter<CollectionWithInfo['socialStats']>();

  likeControl = new FormControl(false);

  ngOnInit(): void {
    this.setupInitialCheckboxValue();
    this.initializeLike();
  }

  private setupInitialCheckboxValue() {
    this.likeControl.setValue(this.isLiked);
  }

  private initializeLike() {
    this.likeControl.valueChanges
      .pipe(
        tap(() => {
          this.likeControl.disable({ emitEvent: false });
        }),

        switchMap((like) => {
          const result = like
            ? this.collectionService.likeCollection(this.collectionId)
            : this.collectionService.unlikeCollection(this.collectionId);

          return result.pipe(
            finalize(() => {
              this.likeControl.enable({ emitEvent: false });
            }),
            catchError(() => EMPTY),
          );
        }),

        takeUntil(this.destroy$),
      )
      .subscribe((newStats) => {
        this.likeProcessed.emit(newStats);
      });
  }
}
