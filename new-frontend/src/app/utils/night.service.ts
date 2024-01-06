import { Injectable } from '@angular/core';
import { TuiBrightness } from '@taiga-ui/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NightService {
  theme = new BehaviorSubject<TuiBrightness>('onDark');

  toggleTheme() {
    if (this.theme.value === 'onDark') {
      this.theme.next('onLight');
    } else {
      this.theme.next('onDark');
    }
  }
}
