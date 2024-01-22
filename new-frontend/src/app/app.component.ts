import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, afterNextRender } from '@angular/core';
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
import { LayoutComponent } from './ui/layout/layout.component';
import { NightThemeComponent } from './ui/night-theme/night-theme.component';
import { AuthService } from '../features/auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from './store';
import { currentUserActions } from '../entities/current-user/actions';

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
  constructor(
    public readonly authService: AuthService,
    private readonly store: Store<AppState>,
  ) {
    afterNextRender(() => {
      this.authService.refresh().subscribe((authInfo) => {
        this.store.dispatch(currentUserActions.set({ user: authInfo.user }));
      });
    });
  }
}
