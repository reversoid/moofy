import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _notifications$ = new Subject<string>();
  private _errors$ = new Subject<string>();

  errors$ = this._errors$.asObservable();
  notifications$ = this._notifications$.asObservable();

  createError(message: string) {
    this._errors$.next(message);
  }

  createNotification(message: string) {
    this._notifications$.next(message);
  }
}
