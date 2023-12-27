import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiIslandComponent, TuiIslandModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [TuiIslandModule, RouterModule, NgOptimizedImage],
  templateUrl: './collection.component.html',
  styleUrl: './collection.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionComponent {}
