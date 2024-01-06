import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiSidebarModule } from '@taiga-ui/addon-mobile';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [TuiSidebarModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {}
