import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiIslandModule } from '@taiga-ui/kit';
import { CollectionGridComponent } from '../../widgets/collection-grid/collection-grid.component';
import { TuiButtonModule } from '@taiga-ui/core';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    TuiIslandModule,
    NgOptimizedImage,
    RouterModule,
    CollectionGridComponent,
    TuiButtonModule,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent {
  follow() {}
}
