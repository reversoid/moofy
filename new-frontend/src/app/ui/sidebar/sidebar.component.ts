import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiSidebarModule } from '@taiga-ui/addon-mobile';
import { TuiButtonModule, TuiLinkModule } from '@taiga-ui/core';
import { TuiIslandModule, TuiMarkerIconModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    TuiSidebarModule,
    TuiButtonModule,
    TuiIslandModule,
    TuiMarkerIconModule,
    RouterModule,
    TuiLinkModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  get profileLink() {
    return ['/profile'];
  }

  openNotifications() {}

  logout() {}
}
