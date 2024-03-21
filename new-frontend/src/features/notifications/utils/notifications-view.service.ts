import { Injectable } from '@angular/core';
import { ProfileDirectNotification } from '../../../shared/types';
import { Subject, debounceTime, map } from 'rxjs';
import { NotificationService } from '../../../app/utils/notification.service';

@Injectable()
export class NotificationsViewService {
  constructor(private readonly notificationsService: NotificationService) {}

  private idsToMarkAsSeen = new Set<ProfileDirectNotification['id']>();

  private events$ = new Subject<void>();

  idsToMarkAsSeen$ = this.events$.asObservable().pipe(
    debounceTime(150),
    map(() => this.idsToMarkAsSeen),
  );

  addIdToViewPool(id: ProfileDirectNotification['id']) {
    this.idsToMarkAsSeen.add(id);
    this.events$.next();
  }

  removeIdFromViewPool(id: ProfileDirectNotification['id']) {
    this.idsToMarkAsSeen.delete(id);
    this.events$.next();
  }
}
