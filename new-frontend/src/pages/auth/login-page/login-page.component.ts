import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiButtonModule } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/kit';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [TuiInputModule, TuiButtonModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {}
