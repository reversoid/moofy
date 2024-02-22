import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiButtonModule } from '@taiga-ui/core';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [TuiButtonModule, NgOptimizedImage],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPageComponent {}
