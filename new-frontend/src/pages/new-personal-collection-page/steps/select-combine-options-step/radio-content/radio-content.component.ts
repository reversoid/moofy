import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-radio-content',
  standalone: true,
  imports: [NgClass],
  templateUrl: './radio-content.component.html',
  styleUrl: './radio-content.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioContentComponent {
  @Input() name: string = '';

  @Input({ required: true }) description!: string;

  @Input({ required: true }) mood!: 'neutral' | 'positive' | 'negative';
}
