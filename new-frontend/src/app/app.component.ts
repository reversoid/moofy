import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutComponent } from './ui/layout/layout.component';
import {
  TUI_SANITIZER,
  TuiAlertModule,
  TuiButtonModule,
  TuiDialogModule,
  TuiModeModule,
  TuiRootModule,
  TuiThemeNightModule,
} from '@taiga-ui/core';
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import { NightService } from './utils/night.service';
import { NotificationService } from './utils/notification.service';
import { takeUntil } from 'rxjs';
import { TuiDestroyService } from '@taiga-ui/cdk';

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
    TuiThemeNightModule,
    TuiModeModule,
    LayoutComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [{ provide: TUI_SANITIZER, useClass: NgDompurifySanitizer }, TuiDestroyService],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  constructor(
    public readonly themeService: NightService,
    private readonly notificationService: NotificationService,
    private readonly _destroy$: TuiDestroyService,
  ) {}

  ngOnInit(): void {
    this.initializeErrorNotifications();
    this.initializeNotifications();
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  private initializeNotifications() {
    this.notificationService.notifications$.pipe(takeUntil(this._destroy$)).subscribe(console.log);
  }

  private initializeErrorNotifications() {
    this.notificationService.errors$.pipe(takeUntil(this._destroy$)).subscribe(console.log);
  }
}
