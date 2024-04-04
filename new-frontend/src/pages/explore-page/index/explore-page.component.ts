import { AsyncPipe, NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiInputModule, TuiIslandModule, TuiRadioLabeledModule } from '@taiga-ui/kit';

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
})
export class ExplorePageComponent {
  constructor(private readonly fb: FormBuilder) {}

  searchObjects = [
    { value: 'users', label: 'Пользователи' },
    { value: 'collections', label: 'Коллекции' },
  ];

  exploreOptionsForm = this.fb.group({
    searchObject: this.fb.control(this.searchObjects[0].value),
    search: this.fb.control(''),
  });
}
