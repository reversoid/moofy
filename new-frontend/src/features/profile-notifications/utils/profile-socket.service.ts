import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class ProfileSocketService extends Socket {
  // TODO fill url

  constructor() {
    super({ url: '' });
  }
}
