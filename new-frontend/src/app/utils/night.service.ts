import { Injectable } from '@angular/core';
import { TuiBrightness } from '@taiga-ui/core';

@Injectable({
  providedIn: 'root',
})
export class NightService {
  theme: TuiBrightness = 'onDark';

  toggleTheme() {
    if (this.theme === 'onDark') {
      this.theme = 'onLight';
    } else {
      this.theme = 'onDark';
    }
  }
}