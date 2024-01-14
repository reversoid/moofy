import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TuiDestroyService } from '@taiga-ui/cdk';
import {
  TUI_SANITIZER,
  TuiAlertModule,
  TuiButtonModule,
  TuiDialogModule,
  TuiModeModule,
  TuiRootModule,
} from '@taiga-ui/core';
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import { takeUntil } from 'rxjs';
import { LayoutComponent } from './ui/layout/layout.component';
import { NightThemeComponent } from './ui/night-theme/night-theme.component';
import { NightService } from './utils/night.service';
import { NotificationService } from './utils/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    TuiButtonModule,
    TuiModeModule,
    LayoutComponent,
    NightThemeComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [{ provide: TUI_SANITIZER, useClass: NgDompurifySanitizer }, TuiDestroyService],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(public readonly themeService: NightService) {}

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
