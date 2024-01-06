import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiLinkModule } from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-creator-island',
  standalone: true,
  imports: [TuiIslandModule, TuiLinkModule, RouterModule, NgOptimizedImage],
  templateUrl: './creator-island.component.html',
  styleUrl: './creator-island.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatorIslandComponent {}
