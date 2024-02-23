import { Injectable } from '@angular/core';
import _ColorHash from 'color-hash';

@Injectable({ providedIn: 'root' })
export class ColorHash extends _ColorHash {
  constructor() {
    super({});
  }
}
