import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiButtonModule } from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';

export interface LinkItem {
  link: string;
  label: string;
}

@Component({
  selector: 'app-links-group',
  standalone: true,
  imports: [TuiIslandModule, TuiButtonModule, NgFor, RouterModule],
  templateUrl: './links-group.component.html',
  styleUrl: './links-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinksGroupComponent {
  /** Zero-indexed item in group */
  @Input() selectedLinkItem: number | null = null;

  @Input() linkItems: LinkItem[] = [];
}
