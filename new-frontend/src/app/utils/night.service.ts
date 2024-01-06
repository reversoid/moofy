import { Injectable } from '@angular/core';
import { TuiBrightness } from '@taiga-ui/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NightService {
  private _theme = new BehaviorSubject<TuiBrightness>('onDark');

  theme = this._theme.asObservable();

  toggleTheme() {
    if (this._theme.value === 'onDark') {
      this._theme.next('onLight');
    } else {
      this._theme.next('onDark');
    }
  }
}
