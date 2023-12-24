import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import {
  TuiRootModule,
  TuiDialogModule,
  TuiAlertModule,
  TUI_SANITIZER,
  TuiThemeNightModule,
  TuiModeModule,
} from '@taiga-ui/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TuiButtonModule } from '@taiga-ui/core';
import { WrapperComponent } from './wrapper/wrapper.component';
import { NightService } from './utils/night.service';
import { UniversalModule } from '@ng-web-apis/universal';

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
    WrapperComponent,
    TuiThemeNightModule,
    TuiModeModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [{ provide: TUI_SANITIZER, useClass: NgDompurifySanitizer }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(public themeService: NightService) {}

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
