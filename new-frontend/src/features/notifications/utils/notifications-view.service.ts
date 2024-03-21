import { Injectable } from '@angular/core';
import { ProfileDirectNotification } from '../../../shared/types';
import { Subject, map } from 'rxjs';

@Injectable()
export class NotificationsViewService {
  private idsToMarkAsSeen = new Set<ProfileDirectNotification['id']>();

  private events$ = new Subject<void>();

  idsToMarkAsSeen$ = this.events$.asObservable().pipe(map(() => this.idsToMarkAsSeen));

  addIdToViewPool(id: ProfileDirectNotification['id']) {
    this.idsToMarkAsSeen.add(id);
    this.events$.next();
  }

  removeIdFromViewPool(id: ProfileDirectNotification['id']) {
    this.idsToMarkAsSeen.delete(id);
    this.events$.next();
  }
}
