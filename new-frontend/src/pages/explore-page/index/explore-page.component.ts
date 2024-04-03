import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
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
  ],
  templateUrl: './explore-page.component.html',
  styleUrl: './explore-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExplorePageComponent {}
