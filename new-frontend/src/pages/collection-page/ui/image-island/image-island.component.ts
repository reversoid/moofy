import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiIslandModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-image-island',
  standalone: true,
  imports: [TuiIslandModule, NgOptimizedImage],
  templateUrl: './image-island.component.html',
  styleUrl: './image-island.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageIslandComponent {}
