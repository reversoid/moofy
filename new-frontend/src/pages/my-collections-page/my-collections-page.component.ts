import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CollectionComponent } from '../../entities/collection/collection.component';
import { TuiInputModule, TuiMarkerIconModule } from '@taiga-ui/kit';
import {
  TUI_SANITIZER,
  TuiLabelModule,
  TuiPrimitiveTextfieldModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
  TuiTextfieldIconDirective,
  TuiTextfieldIconLeftDirective,
} from '@taiga-ui/core';
import { NgDompurifyModule, NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-collection-page',
  standalone: true,
  imports: [
    CollectionComponent,
    TuiInputModule,
    TuiLabelModule,
    TuiTextfieldControllerModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './my-collections-page.component.html',
  styleUrl: './my-collections-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [],
})
export class MyCollectionsPageComponent {
  search = new FormControl<string>('');
}
