import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {
  TuiButtonModule,
  TuiLinkModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiCheckboxModule,
  TuiInputModule,
  TuiIslandModule,
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
  ],
  templateUrl: './collection-page.component.html',
  styleUrl: './collection-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionPageComponent {
  search = new FormControl<string>('');
}
